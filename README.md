## Описание [EAST смарт контракта](https://gitlab.wvservices.com/waves-enterprise/east-contract)

### Методы контракта:
Метод = ключ параметра вызова контракта.  
#### mint
<b> Описание: </b>
Создаёт vault для пользователя с указанным колличеством токенов. Добавляет на баланс пользователя EAST токенов. Дополнительным параметром вызова передаются id транзакций ораклов использовавшихся для расчётов.  
<b> Кто может вызвать: </b>
Только создатель контракта  
<b>Триггеры: </b>
Пользователь делает transfer с WEST токенами на адрес владельца EAST контракта, после появления транзакции в блокчейне сервис автоматизации расчитывает количество EAST токенов и вызывает данный метод  
<b>Тело метода: </b>
```js
  address: string,
  eastAmount: number, // колличество EAST токенов обеспеченных данной позицией
  westAmount: number, // колличество замороженных WEST токенов
  usdpAmount: number, // колличество замороженных USDP токенов
```  
<b>Результат выполнения: </b>
- добавляет ключ `vault_${tx.id}` хранит в себе информацию о vault пользователя c указанным адресом, vault id = transaction.id
- добавляет ключ `balance_${address}` хранит в себе колличество EAST токенов для адреса
- обновляет значение ключа `total_supply`  

#### transfer
<b> Описание: </b>
Перевод указанного количества EAST на указанный адрес  
<b> Кто может вызвать: </b>
Только владелец EAST токенов  
<b>Тело метода: </b>
```js
  to: string, // получатель
  eastAmount: number
```  
<b>Результат выполнения: </b>
- обновляет значения ключей балансов `balance_${address}` для отправителя и получателя  

#### burn
<b> Описание: </b>
Закрывает vault пользователя, сжигает EAST токены, сервис автоматизации возвращает пользователю WEST и USDP  
<b> Кто может вызвать: </b>
Владелец позиции(vault). Необходимо условие - transaction.sender = vault.address  
<b>Триггеры: </b>
Пользователь вызывает контракт, после его выполения - сервис автоматизации возвращает пользователю WEST и USDP токены по адресу из vault  
<b>Тело метода: </b>
```js
  vault: string, // vault id
```  
<b>Результат выполнения: </b>
- обновляет значениe ключа `balance_${address}`, если баланса EAST меньше чем vault.eastAmount то операция не выполняется 
- обновляет значение ключа `total_supply`
- удаляет ключ `vault_${vault.id}` хранившего в себе информацию о vault  

#### recalculate_execute
<b> Описание: </b>
Изменяет колличество токенов в обеспечении либо EAST токенов в записимости от триггера. Дополнительным параметром вызова передаются id транзакций ораклов использовавшихся для расчётов.  
<b> Кто может вызвать: </b>
Только создатель контракта  
<b>Триггеры: </b>
- для дообеспечения позиции пользователь делает transfer с WEST токенами на адрес владельца EAST контракта с приложением: attachment = supply, после появления транзакции в блокчейне сервис автоматизации добавляет сумму перевода к уже имеющимся в обеспечении и вызывает данный метод.(обновляется только westAmount)
- для выпуска дополнительных EAST токенов пользователь вызывает контракт с параметром recalculate_init и значением vault.id. После появления транзакции в блокчейне, случае если стоимость токена выросла то сервис автоматизации перерасчитывает значения usdpAmount и eastAmount так чтобы обеспечение опять стало 250% и вызывает данный метод. Вторым параметром прикрепляются id ораклов использовавшихся для расчёта.
- Если обеспечение WEST падает менее 120% то сервис атоматизации использует WEST для покупки USDP и выставляет в vault значения usdpAmount = eastAmount, westAmount = 0.(TODO)  
<b>Тело метода: </b>
```js
  eastAmount?: number, // новое колличество EAST токенов обеспеченных данной позицией
  westAmount?: number, // новое колличество замороженных WEST токенов
  usdpAmount?: number, // новое колличество замороженных USDP токенов
  vault: string // vault id
```  
<b>Результат выполнения: </b>
- обновляет ключ `vault_${vault.id}` хранит в себе информацию о vault
- обновляет ключ `balance_${address}` если есть разница между старым и новым значением eastAmount
- обновляет значение ключа `total_supply` если есть разница между старым и новым значением eastAmount  


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
