## Описание [EAST смарт контракта](https://gitlab.wvservices.com/waves-enterprise/east-contract)

### Краткое описание методов:
- [mint](#mint) - выпуск EAST, открытие позиции
- [transfer](#transfer) - перевод EAST
- [burn_init](#burn_init) - запрос на закрытие позиции
- [burn](#burn) - закрытие позиции
- [recalculate](#recalculate) - довыпуск EAST
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
    usdpPart:  0.5,
    westCollateral: 2.5,
    liquidationCollateral: 1.3,
    minHoldTime: 1000 * 60 * 60,
    USDapTokenId: 'USDap token id',
    issueEnabled: true
  })
}
```

Где:
- oracleContractId - id контракта ораклов, с обязательными стримами 000010_latest (курс WEST) и 000003_latest (курс USDP)
- oracleTimestampMaxDiff - максимальная разница во времени между текущим моментом и последними данными ораклов, при большей разнице сделка не производится. в миллисекундах
- usdpPart - какую часть позиции занимает USDP обеспечение, остальная часть обеспечена WEST токенами
- westCollateral - во сколько раз переобеспечена часть позиции WEST токенами
- liquidationCollateral - границе обеспечения WEST токенами после которой возможна ликвидация позици (продажа WEST токенов и переход к 100% обеспечению USDP)
- minHoldTime - минимальное время удержания позиции до возможности её закрытия пользователем
- USDapTokenId - пользовательский токен, аналог USDap в блокчейне WE 
- issueEnabled - если стоит false то методы mint и recalculate недоступны

### Методы контракта:
Метод = ключ параметра вызова контракта.  

#### mint
<b> Описание: </b>
Создаёт Vault пользователя, переводит перечисленные WEST токены из трансфера в USDP и часть оставляет для обспечения, добавляет на баланс пользователя EAST токенов. Перевод осуществляется по курсу из данных ораклов.  
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
- добавляет ключ `vault_${tx.id}` хранит в себе информацию о vault пользователя c указанным адресом, vault id = transaction.id
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
  eastAmount: number
```  
<b>Результат выполнения: </b>
- обновляет значения ключей балансов `balance_${address}` для отправителя и получателя  

#### burn_init
<b> Описание: </b>
Запрос пользователя на закрытие vault и возврат токенов находящихся в обеспечении  
<b> Доступ к методу: </b>
Владелец позиции(vault). Необходимо условие - transaction.sender = vault.address  
<b>Тело метода: </b>
```js
  vaultId: string, // vault id
```  
<b>Результат выполнения: </b>
без результата  

#### burn
<b> Описание: </b>
Закрывает vault пользователя, сжигает EAST токены, сервис автоматизации возвращает пользователю WEST и USDP трансфером. Сервис автоматизации отправляет атомик транзакцию с двумя трансферами и вызовом контракта, контракт проверяет трансферы, сумму в трансферах - должна  быть эквивалента сумме из vault, так же проверяет получателя и отправителя.  
<b> Доступ к методу: </b>
Владелец контракта  
<b>Триггеры: </b>
Пользователь вызывает контракт с методом burn_init, после его выполения - сервис автоматизации отправляет атомик транзакцию с трансферами WEST и USDP с колличеством из vault пользователя, и данный вызов контракта.  
<b>Тело метода: </b>
```js
  vault: string, // vault id
  westTransferId: string,
  usdpTransferId: string
```  
<b>Результат выполнения: </b>
- обновляет значениe ключа `balance_${address}`, если баланса EAST меньше чем vault.eastAmount то операция не выполняется 
- обновляет значение ключа `total_supply`
- удаляет ключ `vault_${vault.id}` хранившего в себе информацию о vault  

#### recalculate
<b> Описание: </b>
Изменяет колличество токенов в обеспечении и количество EAST токенов пользователя в соответствии с текущим курсом взятом из ораклов. Изменение всегда происходит в сторону увеличения, если курс WEST токенов упал то метод не выполняется  
<b> Доступ к методу: </b>
Владелец vault  
<b>Тело метода: </b>
```js
  vaultId: string // vault id
```  
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
  vaultId: string // vault id
```  
<b>Результат выполнения: </b>
- обновляет ключ `vault_${tx.id}` хранящего в себе информацию о vault пользователя

#### claim_overpay_init
<b> Описание: </b>
Запрос пользователя на вывод лишних WEST токенов из vault (при росте курс WEST)  
<b> Доступ к методу: </b>
Владелец позиции(vault). Необходимо условие - transaction.sender = vault.address  
<b>Тело метода: </b>
```js
  vaultId: string, // vault id
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
  vault: string, // vault id
  transferId: string,
  requestId: string // claim_overpay_init call id
```  
<b>Результат выполнения: </b>
- добавляет ключ `exchange_${transferId}`  
- обновляет ключ `vault_${vault.id}`  


#### liquidate
<b> Описание: </b>
Если в случае падение курса WEST, обеспечение WEST падает менее значения liquidationCollateral из конфига контракта то сервис атоматизации вызывает данный метод, который проверяет по последним данным ораклов действительно ли обеспечение упало ниже liquidationCollateral и записывает в vault значения usdpAmount = eastAmount, westAmount = 0. После этого пользователь больше не может закрыть позицию. В случае если обеспечение WEST больше liquidationCollateral то вызов метода не производится.  
<b> Доступ к методу: </b>
Владелец контракта (сервис автоматизации)  
<b>Тело метода: </b>
```js
  vaultId: string // vault id
```  
<b>Результат выполнения: </b>
- обновляет ключ `vault_${tx.id}` хранящего в себе информацию о vault пользователя

#### update_config
<b> Описание: </b>
Метод для обновления конфига. Описания параметров в разделе "Создание контракта"  
<b> Доступ к методу: </b>
Владелец контракта (сервис автоматизации)  
<b>Тело метода: </b>
```js
  oracleContractId: string,
  oracleTimestampMaxDiff: number,
  usdpPart: number,
  westCollateral: number,
  liquidationCollateral: number,
  minHoldTime: number,
  USDapTokenId: string,
  issueEnabled: boolean
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
3) Restart compose
4) Run logger: `npm run logger`
4) Build test contract image and watch logger output:
`npm run test`

### Create docker image and push it to registry
```
docker login registry.vostokservices.com
docker build -t east-contract:0.1 .
docker tag east-contract:0.1 registry.vostokservices.com/vostok-sc/east-contract:0.1
docker push registry.vostokservices.com/vostok-sc/east-contract:0.1
```

##### Get image hash
`docker inspect east-contract:0.1` -> "Id"
