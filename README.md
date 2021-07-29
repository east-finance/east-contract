## Описание [EAST смарт контракта](https://gitlab.wvservices.com/waves-enterprise/east-contract)

Данный смарт контракт создаёт стэйбл коин EAST с обеспечением на основе выбранного RWA(real word asset) и токена WEST, гарантирует что обеспеспечение одного EAST будет не меньше 1$ в токенах RWA. Смарт контракт регулирует отношения между пользователем и владельцем контракта (сервисом автоматизации).

### Краткое описание методов:
- [mint](#mint) - выпуск EAST, открытие позиции
- [transfer](#transfer) - перевод EAST
- [close_init](#close_init) - запрос на закрытие позиции
- [close](#close) - закрытие позиции
- [reissue](#reissue) - довыпуск EAST
- [supply](#supply) - дообеспечить позицию токенами WEST
- [claim_overpay_init](#claim_overpay_init) - запрос на вывод токенов WEST из позиции (при переобеспечении)
- [claim_overpay](#claim_overpay) - вывод токенов WEST из позиции
- [liquidate](#liquidate) - ликвидация позиции
- [update_config](#update_config) - обновление конфига контракта  

### Создание контракта:
Контракт создаётся с параметром вида:
```js
{
  type: 'string',
  key: 'config',
  value: JSON.stringify({
    oracleContractId: 'oracleContractId',
    oracleTimestampMaxDiff: 1000 * 10,
    rwaPart:  0.5,
    westCollateral: 2.5,
    liquidationCollateral: 1.3,
    minHoldTime: 1000 * 60 * 60,
    rwaTokenId: 'Rwa token id',
    isContractEnabled: true
  })
}
```

Где:
- oracleContractId - id контракта ораклов, с обязательными стримами 000010_latest (курс RWA - USDap в данном случае) и 000003_latest (курс WEST)
- oracleTimestampMaxDiff - максимальная разница во времени между текущим моментом и последними данными ораклов, при большей разнице сделка не производится. в миллисекундах
- rwaPart - какую часть позиции занимает RWA(real world asset) обеспечение, остальная часть обеспечена WEST токенами
- westCollateral - во сколько раз переобеспечена часть позиции WEST токенами
- liquidationCollateral - границе обеспечения WEST токенами после которой возможна ликвидация позици (продажа WEST токенов и переход к 100% обеспечению RWA)
- minHoldTime - минимальное время удержания позиции до возможности её закрытия пользователем
- rwaTokenId - пользовательский токен, аналог RWA в блокчейне WE. Decimals = 8
- isContractEnabled - если стоит false, то все операции с контрактом будут заблокированы.

### Методы контракта:
Метод = ключ параметра вызова контракта.  

#### mint
<b> Описание: </b>
Создаёт Vault пользователя, переводит перечисленные WEST токены из трансфера в RWA и часть оставляет для обспечения, добавляет на баланс пользователя EAST токенов. Перевод осуществляется по курсу из данных ораклов. Если vault для пользователя уже существует то вызов отменяется.  
<b> Как вызвать: </b>
Рекомендуемый вариант - сделать атомик транзакцию, с трансфером и вызовом контракта.
Получатель трансфера должен быть создатель данного контракта.    
Трансфер должен идти раньше самого вызова. Отправитель трансфера и отправитель вызова контракта должен быть один и тот же адрес.  
<b> Доступ к методу: </b>
Любой пользователь  
<b>Тело метода: </b>
```js
  transferId: string // id трансфера
```  
<b>Результат выполнения: </b>
- добавляет ключ `vault_${address}` хранит в себе информацию о vault пользователя c указанным адресом, vault id = address
- добавляет ключ `balance_${address}` хранит в себе колличество EAST токенов для адреса
- обновляет значение ключа `total_supply`  
- добавляет ключ `exchange_${transferId}`  

#### transfer
<b> Описание: </b>
Перевод указанного количества EAST на указанный адрес  
<b> Доступ к методу: </b>
Только владелец EAST токенов  
<b>Тело метода: </b>
```js
  to: string, // получатель
  amount: number
```  
<b>Результат выполнения: </b>
- обновляет значения ключей балансов `balance_${address}` для отправителя и получателя  

#### close_init
<b> Описание: </b>
Запрос пользователя на закрытие vault и возврат токенов находящихся в обеспечении  
<b> Доступ к методу: </b>
Владелец позиции(vault). Необходимо условие - transaction.sender = vault.address  
<b>Тело метода: </b>
пустое тело  
<b>Результат выполнения: </b>
без результата  

#### close
<b> Описание: </b>
Закрывает vault пользователя, сжигает EAST токены, сервис автоматизации возвращает пользователю WEST и RWA трансфером. Сервис автоматизации отправляет атомик транзакцию с двумя трансферами и вызовом контракта, контракт проверяет трансферы, сумму в трансферах - должна  быть эквивалента сумме из vault (за вычетом комиссии 0.3 WEST за транзакции), так же проверяет получателя и отправителя.  
<b> Доступ к методу: </b>
Владелец контракта  
<b>Триггеры: </b>
Пользователь вызывает контракт с методом burn_init, после его выполения - сервис автоматизации отправляет атомик транзакцию с трансферами WEST и RWA с колличеством из vault пользователя, и данный вызов контракта.  
<b>Тело метода: </b>
```js
  address: string, // vault id
  westTransferId: string,
  rwaTransferId: string
```  
<b>Результат выполнения: </b>
- обновляет значениe ключа `balance_${address}`, если баланса EAST меньше чем vault.eastAmount то операция не выполняется 
- обновляет значение ключа `total_supply`
- удаляет ключ `vault_${address}` хранившего в себе информацию о vault  

#### reissue
<b> Описание: </b>
Изменяет колличество токенов в обеспечении и количество EAST токенов пользователя в соответствии с текущим курсом взятом из ораклов. Изменение всегда происходит в сторону увеличения, если курс WEST токенов упал то метод не выполняется  
<b> Доступ к методу: </b>
Владелец vault  
<b>Тело метода: </b>
```js
  maxWestToExchange: number // vault id
```  
maxWestToExchange - максимальное колличество west для обменя на east, меньше этого значения может быть, больше - нет  
<b>Результат выполнения: </b>
- обновляет ключ `vault_${vault.id}` хранит в себе информацию о vault
- обновляет ключ `balance_${address}` если есть разница между старым и новым значением eastAmount
- обновляет значение ключа `total_supply` если есть разница между старым и новым значением eastAmount  

#### supply
<b> Описание: </b>
Для избежания ликвидации позиции в случае падения курса WEST, пользователь дообеспечивает позицию. Контракт переводит перечисленные WEST токены из трансфера в vault пользователя.  
<b> Как вызвать: </b>
Рекомендуемый вариант - сделать атомик транзакцию, с трансфером и вызовом контракта.
Получатель трансфера должен быть создатель данного контракта.    
Трансфер должен идти раньше самого вызова. Отправитель трансфера и отправитель вызова контракта должен быть один и тот же адрес.  
<b> Доступ к методу: </b>
Владелец vault  
<b>Тело метода: </b>
```js
  transferId: string // id трансфера
```  
<b>Результат выполнения: </b>
- обновляет ключ `vault_${address}` хранящего в себе информацию о vault пользователя

#### claim_overpay_init
<b> Описание: </b>
Запрос пользователя на вывод лишних WEST токенов из vault (при росте курс WEST)  
<b> Доступ к методу: </b>
Владелец позиции(vault)  
<b>Тело метода: </b>
```js
  amount: number // не обязательный параметр, сумма вывода 
```  
<b>Результат выполнения: </b>
без результата  

#### claim_overpay
<b> Описание: </b>
Вывывает владелец контракта после вызова claim_overpay_init, переводит на адрес владельца WEST токены, контракт же списывает с vault пользователя переведённые токены, уменьшая значение westAmount на сумму перевода и комиссию транзакций равную 0.2 WEST.  
<b> Доступ к методу: </b>
Владелец контракта  
<b>Триггеры: </b>
Пользователь вызывает контракт с методом claim_overpay_init, после его выполения - в случае переобеспечения vault сервис автоматизации считает количество токенов которые необходимо вернуть пользователю и отправляет атомик транзакцию с трансфером WEST и данный вызов контракта. В случае если vault не переобеспечен, вызов claim_overpay_init игнорируется.  
<b>Тело метода: </b>
```js
  address: string, // vault id
  transferId: string,
  requestId: string // claim_overpay_init call id
```  
<b>Результат выполнения: </b>
- добавляет ключ `exchange_${transferId}`  
- обновляет ключ `vault_${address}`  


#### liquidate
<b> Описание: </b>
Если в случае падение курса WEST, обеспечение WEST падает менее значения liquidationCollateral из конфига контракта то сервис атоматизации вызывает данный метод, который проверяет по последним данным ораклов действительно ли обеспечение упало ниже liquidationCollateral и записывает в vault значения rwaAmount = eastAmount, westAmount = 0. После этого пользователь больше не может закрыть позицию. В случае если обеспечение WEST больше liquidationCollateral то вызов метода не производится.  
<b> Доступ к методу: </b>
Владелец контракта (сервис автоматизации)  
<b>Тело метода: </b>
```js
  address: string // vault id
```  
<b>Результат выполнения: </b>
- обновляет ключ `vault_${address}` хранящего в себе информацию о vault пользователя

#### update_config
<b> Описание: </b>
Метод для обновления конфига. Описания параметров в разделе "Создание контракта"  
<b> Доступ к методу: </b>
Владелец контракта (сервис автоматизации)  
<b>Тело метода: </b>
```js
  oracleContractId: string,
  oracleTimestampMaxDiff: number,
  rwaPart: number,
  westCollateral: number,
  liquidationCollateral: number,
  minHoldTime: number,
  rwaTokenId: string,
  isContractEnabled: boolean
```  
<b>Результат выполнения: </b>
- обновляет ключ `config` хранящего в себе информацию о параметрах контракта


### Run tests
Requirements: Docker, NodeJs

1) Install nodes sandbox to <sandbox_dir>: https://docs.wavesenterprise.com/ru/latest/how-to-setup/sandbox.html
2) Update nodes config section `docker-engine` at <sandbox_dir>/config/nodes/node-*/node.conf:
    ```
    docker-engine {
      enable = "yes"
      use-node-docker-host = "yes"
      execution-limits {
        timeout = "100s"
        memory = 1024
        memory-swap = 0
        startup-timeout = "100s"
      }
      remove-container-on-fail = "no"
      remove-container-after = "30m"
    }
    ```
    ```
    pre-activated-features {
      2 = 0
      3 = 0
      4 = 0
      5 = 0
      6 = 0
      7 = 0
      9 = 0
      10 = 0
      100 = 0
      101 = 0
      120 = 0
      140 = 0
    }
    ```
3) Restart compose
4) Issue permissions to 3NdqnzceY42SdwC9rYA1HgdkDkRc6DnWug6U to publish contracts.
5) Transfer west to 3NdqnzceY42SdwC9rYA1HgdDkRc6DnWug6U
6) Run logger: `npm run logger`
7) Build test contract image and watch logger output:
`npm run test`

### Create docker image and push it to registry
```
docker login registry.wvservices.com
docker build -t east-contract:0.6-RC1 .
docker tag east-contract:0.6-RC1 registry.wvservices.com/vostok-sc/east-contract:0.6-RC1 
docker push registry.wvservices.com/vostok-sc/east-contract:0.6-RC1 
```


```
docker build --build-arg HOST_NETWORK=192.168.1.3 -t vostok-sc/east-contract:0.8-RC6 .
```

##### Get image hash
`docker inspect east-contract:0.1` -> "Id"
