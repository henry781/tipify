# tipify
[![Build Status](https://travis-ci.com/henry781/tipify.svg?branch=master)](https://travis-ci.com/henry781/tipify)

## Usage

```
npm install --save tipify
```

Enable decorators in tsconfig.
```
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    ...
```

Instantiate a new converter.
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


## Implicit type mapping
When type is not specified in `@jsonProperty` decorator, mapper will try to get type information from emitted metadata.
Warning : It does not works with array and generics.

```
@jsonObject()
export class Passenger {

    @jsonProperty('id')
    private _id: number;

    @jsonProperty('name')
    private _name: string;

    @jsonProperty('active')
    private _active: boolean;
    
    @jsonProperty('airline')
    private _airline: Airline;
}
```

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

## Validation

### How it works ?

Before deserialization, data can be validated.

Validation is enabled by `@jsonProperty` third field :

```
@jsonObject({discriminatorProperty: 'type'})
export abstract class Vehicle {

    @jsonProperty('type', String, [JsonValidators.required])
    public _type: string;

    @jsonProperty('id', Number, [JsonValidators.required])
    public _id: number;

    @jsonProperty('name', String, [JsonValidators.required])
    public _name: string;
...
```

Implemented validation :
* required

### Custom validation

You may want to add your own validation functions :

```
public static required: JsonValidator = (obj: any, serializedName: string) => {
    if (!obj.hasOwnProperty(serializedName)) {
        throw new JsonConverterError('value is required');
    }
};
```
