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
|Attribute              |Type                  |Description                                                                                             |
|-----------------------|----------------------|--------------------------------------------------------------------------------------------------------|
|All from CharAttributes|`CharAttributes[k]`   |The properties to pass to the underlying characters. doubleWidth, doubleHeight won't apply for fillChars|
|fillChar               |`string`              |The character to fill holes with (can be useful for transparency)                                       |
|width                  |`number`              |The desired width of the element                                                                        |
|height                 |`number`              |The desired height of the element                                                                       |
|wrap                   |`string`              |The behaviour of text overflowing                                                                       |
|textAlign              |`string`              |The way text should be aligned (start, middle, or end)                                                  |
|flexGrow               |`boolean` or `string` |The flexGrow factor to be applied (refer to CSS flex-grow)                                              |

### new Minitel
|Argument (in order)|Type      |Description                                       |
|-------------------|----------|--------------------------------------------------|
|stream             |`Duplex`  |The duplex stream to communicate with the minitel |
|settings           |`Settings`|The setings to configure the minitel instance with|

#### On Settings
|Argument |Type      |Description                                                       |
|---------|----------|------------------------------------------------------------------|
|statusBar|`boolean` |Whether to consider the first line of the render as the status bar|
|localEcho|`boolean` |Whether to keep local echo (écho local) enabled                   |

### &lt;vjoin&gt;
Will vertically join all children
|Attribute            |Type                  |Description                                                                             |
|---------------------|----------------------|-----------------------------------------------------------------|
|gap                  |`number` or `string`  |The amount of gap to be had. Can be a number or space-{between,around,evenly} (refer to flexbox's justify-center)|
|widthAlign           |`string`              |The way to align along the x axis (start, middle, end or stretch)|
|heightAlign          |`string`              |The way to align along the y axis (start, middle or end)         |

### &lt;hjoin&gt;
Will horizontally join all children
|Attribute            |Type                  |Description                                                      |
|---------------------|----------------------|-----------------------------------------------------------------|
|gap                  |`number` or `string`  |The amount of gap to be had. Can be a number or space-{between,around,evenly} (refer to flex's justify-center)|
|heightAlign          |`string`              |The way to align along the y axis (start, middle, end or stretch)|
|widthAlign           |`string`              |The way to align along the x axis (start, middle or end)         |

### &lt;input&gt;
Will be an input
|Attribute            |Type                  |Description                                                      |
|---------------------|----------------------|-----------------------------------------------------------------|
|autofocus            |`boolean`             |Whether or not to autofocus on the input                         |
|type                 |`string`              |The type of input (for now, text or password)                    |

### &lt;para&gt;
Will show text
