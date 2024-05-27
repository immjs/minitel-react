# Minitel React

A (somewhat experimental! also somewhat opiniated) package to render react into a minitel!

<small>*Experimental until v4.2.0, thanks for understanding!*<small>

![](assets/Hello%20NPM.png)

## Principle

This package interacts with a stream which is supposed to be relayed to the Minitel. The duplex stream could come from, for instance, a serial handler.

## Example

```jsx
import { SerialPort } from 'serialport';
import { render, Minitel } from 'minitel-react';

const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 1200, parity: 'even' });

function App() {
    return (
        <yjoin widthAlign="middle" heightAlign="middle">
            <para invert>
                Hello world!
            </para>
        </yjoin>
    );
}

render(<App/>, new Minitel(serialport));
```

Also: an example with websockets, miedit minitel (You may need to clone [miedit](https://github.com/Zigazou/miedit) into `miedit/` first), inside the dist/examples folder

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
|ref                    |`RefObject`           |The ref which should store the underlying document. The relevant classes are in [`minitel-standalone`](https://github.com/immjs/minitel-standalone) (docs to be written) |
|textAlign              |`string`              |The way text should be aligned (start, middle, or end)                                                  |
|flexGrow               |`boolean` or `number` |The flexGrow factor to be applied (refer to CSS flex-grow). `true` is interpreted as `1`                |
|visible                |`boolean`             |If `false`, the element will only be displayed as a grid of its `fillChar`s                             |

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

### &lt;yjoin&gt;
Will vertically join all children
|Attribute            |Type                  |Description                                                                             |
|---------------------|----------------------|-----------------------------------------------------------------|
|gap                  |`number` or `string`  |The amount of gap to be had. Can be a number or space-{between,around,evenly} (refer to flexbox's justify-center)|
|widthAlign           |`string`              |The way to align along the x axis (start, middle, end or stretch)|
|heightAlign          |`string`              |The way to align along the y axis (start, middle or end)         |

### &lt;xjoin&gt;
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
|multiline            |`boolean`             |Whether or not the input should be multiline                     |
|onChange             |`function(value)`     |A function to be called whenever the input is changed            |
|onScroll             |`function([dy, dx])`  |A function to be called whenever the input is scolled            |

### &lt;para&gt;
Will show text

### &lt;scroll&gt;
Will allow scrolling (the element needs to be focused to be scrolled upon)

#### Attributes

| Attribute            | Type                                | Description                                                            |
|----------------------|-------------------------------------|------------------------------------------------------------------------|
| overflowX            | `string`                            | Horizontal overflow behavior: refer to description under the table     |
| overflowY            | `string`                            | Vertical overflow behavior: refer to description under the table       |
| autofocus            | `false`                             | Whether autofocus is enabled for the scrollable area.                  |
| disabled             | `boolean`                           | Whether this element is unfocusable                                    |
| scrollbarColor       | `number`                            | The color code for the scrollbar.                                      |
| scrollbarBackColor   | `number`                            | The color code for the scrollbar background.                           |
| blinkPeriod          | `number`                            | The blinking period for the scrollbar (in milliseconds).               |
| onScroll             | `function([dy, dx])`                | A function to be called whenever the scroll is scolled                 |


`noscrollbar` will hide the scrollbar
`auto` will hide the scrollbar except when the scrollable area exists (I.E. content does not fit)
`scroll` and `pad` only differ in the case that the children already fit in the imposed area: `scroll` will show the scrollbar anyway, while `pad` will leave this space empty

### &lt;cont&gt;

Will hold one child.

#### Attributes

| Attribute     | Type          | Description                                                                                       |
|---------------|---------------|---------------------------------------------------------------------------------------------------|
| widthAlign    | `Align`       | The alignment of child elements along the horizontal axis (`start`, `middle`, `end`, or `stretch`). |
| heightAlign   | `Align`       | The alignment of child elements along the vertical axis (`start`, `middle`, `end`, or `stretch`).   |

### &lt;zjoin&gt;

Will allow stacking of one element onto another. The character `\x09` will order `zjoin` to show the character underneath.

#### Attributes

| Attribute            | Type       | Description                                                                                       |
|----------------------|------------|---------------------------------------------------------------------------------------------------|
| widthAlign           | `Align`    | The alignment of child elements along the horizontal axis (`start`, `middle`, `end`, or `stretch`). |
| heightAlign          | `Align`    | The alignment of child elements along the vertical axis (`start`, `middle`, `end`, or `stretch`).   |
| inheritTransparency  | `boolean`  | Whether child elements should have fillChar set to `\x09` by default                              |
