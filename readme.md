# Minitel React

A (somewhat experimental! also somewhat opiniated) package to render react into a minitel!

<small>*it's silly and dumb haha dont actually use it until v4.2.0 i pledge it will be better then*<small>

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

render(<App/>, new Minitel(serialport));
```

## Reference

### CharAttributes

|Attribute   |Type     |Default|Description                        |
|------------|---------|-------|-----------------------------------|
|fg          |`number` |7      |The foreground color to be used    |
|bg          |`number` |0      |The background color to be used    |
|underline   |`boolean`|false  |Whether to underline or not        |
|sizeCode    |`number` |0      |The size code to be used           |
|noBlink     |`boolean`|true   |Whether to not blink or to blink   |
|invert      |`boolean`|true   |Whether to invert or not           |
|doubleWidth |`boolean`|true   |Whether to use double width or not |
|doubleHeight|`boolean`|true   |Whether to use double height or not|

#### On colors
|Color code|Color  |Brightness|
|----------|-------|----------|
|0         |Black  |0%        |
|1         |Red    |50%       |
|2         |Green  |70%       |
|3         |Yellow |90%       |
|4         |Blue   |40%       |
|5         |Magenta|60%       |
|6         |Cyan   |80%       |
|7         |White  |100%      |

### MinitelObjectAttributes
|Attribute              |Type                  |Description                                                                             |
|-----------------------|----------------------|----------------------------------------------------------------------------------------|
|All from CharAttributes|`CharAttributes[k]`   |The properties to pass to the underlying characters. Will not apply to fillChar for size|
|fillChar               |`string`              |The character to fill holes with (can be useful for transparency)                       |
|widthAlign             |`string`              |The way to align along the x axis (start for left, middle for middle, end for right)    |
|heightAlign            |`string`              |The way to align along the y axis (start for top, middle for middle, end for bottom)    |
|width                  |`number`              |The desired width of the element                                                        |
|height                 |`number`              |The desired height of the element                                                       |
|wrap                   |`string`              |The behaviour of text overflowing                                                       |
|gap                    |`number` or `string`  |The behaviour of text overflowing                                                       |


### &lt;vjoin&gt;
Will vertically join all children
|Attribute            |Type                  |Description                                                                                                   |
|---------------------|----------------------|--------------------------------------------------------------------------------------------------------------|
|gap                  |`number` or `string`  |The amount of gap to be had. Can be a number or space-{between,around,evenly} (refer to flex's justify-center)|

### &lt;hjoin&gt;
Will horizontally join all children
|Attribute            |Type                  |Description                                                                                                   |
|---------------------|----------------------|--------------------------------------------------------------------------------------------------------------|
|gap                  |`number` or `string`  |The amount of gap to be had. Can be a number or space-{between,around,evenly} (refer to flex's justify-center)|

### &lt;para&gt;
Will show text
