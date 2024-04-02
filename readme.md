# Minitel React

A (somewhat experimental!) package to render react into a minitel!

## Principle

This package interacts with a stream which is supposed to be relayed to the Minitel. The duplex stream could come from, for instance, a serial handler.

## Example

```jsx
import { SerialPort } from 'serialport';
import { render, Minitel } from 'minitel-react';

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 1200, parity: 'even' });

function App() {
    return (
        <vjoin widthAlign="middle" heightAlign="middle">
            <para invert>
                Hello world!
            </para>
        </vjoin>
    );
}

```

## Reference

### CharAttributes

|Attribute  |Type     |Default|Description                     |
|-----------|---------|-------|--------------------------------|
|fg         |`number` |7      |The foreground color to be used |
|bg         |`number` |0      |The background color to be used |
|underline  |`boolean`|false  |Whether to underline or not     |
|sizeCode   |`number` |0      |The size code to be used        |
|noBlink    |`boolean`|true   |Whether to not blink or to blink|
|invert     |`boolean`|true   |Whether to invert or not        |

#### On colors
|Color code|Color|Brightness|
|----------|-----|----------|
|0         |Black|0%        |
|1         |Red  |20%       |
|2         |Green|20%       |
|2         |Green|20%       |

### MinitelObjectAttributes

| Attribute | Type | Description |
|-----------|------|-------------|
|

### vjoin


