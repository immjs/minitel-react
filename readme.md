# Minitel React

A (somewhat experimental!) package to render react into a minitel!

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

|Attribute  |Type     |Default|Description                     |
|-----------|---------|-------|--------------------------------|
|fg         |`number` |7      |The foreground color to be used |
|bg         |`number` |0      |The background color to be used |
|underline  |`boolean`|false  |Whether to underline or not     |
|sizeCode   |`number` |0      |The size code to be used        |
|noBlink    |`boolean`|true   |Whether to not blink or to blink|
|invert     |`boolean`|true   |Whether to invert or not        |

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

#### On the sizeCode
*(it's dumb, i'll change it later; also it's not working yet)*
|Size code |Double height?|Double width?|
|----------|--------------|-------------|
|0         |No            |No           |
|1         |Yes           |No           |
|2         |No            |Yes          |
|3         |Yes           |Yes          |

### MinitelObjectAttributes
|Attribute  |Type    |Description                                                                         |
|-----------|--------|------------------------------------------------------------------------------------|
|fillChar   |`string`|The character to fill holes with (can be useful for transparency)                   |
|widthAlign |`string`|The way to align along the x axis (start for left, middle for middle, end for right)|
|heightAlign|`string`|The way to align along the y axis (start for top, middle for middle, end for bottom)|
|width      |`number`|The desired width of the element                                                    |
|height     |`number`|The desired height of the element                                                   |
|wrap       |`string`|The behaviour of text overflowing                                                   |


### vjoin
Will vertically join all children

### hjoin
Will horizontally join all children

### para
Will show text
