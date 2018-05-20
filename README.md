# jsontypescript

Inspired by : https://github.com/dhlab-basel/json2typescript
## Usage

```
const car = new Car();

const converter = new JsonConverter();

const json = converter.serialize(car);

const car2 = converter.deserialize(car, Car);
```

## Mapping

```
@jsonObject()
export class Passenger {

    @jsonProperty('pid', PidConverter)
    private _pid: Pid;

    @jsonProperty('gender', Enum(Gender, EnumStrategy.INDEX_COMPATIBLE))
    private _gender: Gender;

    @jsonProperty('name', String)
    private _name: string;

    @jsonProperty('informations', Any)
    private _informations: object;

    constructor(options?: PassengerOptions) {
        if (options) {
            this._pid = options.pid;
            this._gender = options.gender;
            this._name = options.name;
            this._informations = options.informations;
        }
    }
}
```

|                |   |
|----------------|---|
| String         |   |
| Number         |   |
| Boolean        |   |
| Any            |   |
| [String]       |   |
| [PidConverter] |   |
| Enum(...)      |   |


## Polymorphism

```
@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type', String)
    private _type: string;
    
    constructor(type?: string) {
        this._type = type;
    }
}

@jsonObject({discriminatorValue: 'car'})
export class Car extends Vehicle {

    constructor() {
        super('car');
    }
}
```

## Enum

```
@jsonProperty('color', Enum(Color, EnumStrategy.NAME_COMPATIBLE))
private _color: Color;
```

|                 |   |
|-----------------|---|
| NAME_COMPATIBLE |   |
| NAME            |   |
| INDEX_COMPATIBLE|   |
| INDEX           |   |

## Custom converter

```
@jsonCustomConverter()
export class PidConverter implements JsonCustomConverter<Pid> {

    public deserialize(obj: any): Pid {
        return undefined;
    }

    public serialize(obj: Pid): any {
        return undefined;
    }
}
```

### Transient

WIP

### Logging

WIP