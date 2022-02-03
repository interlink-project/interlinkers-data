import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  Grid,
  SvgIcon,
  alpha,
  IconButton
} from '@material-ui/core';
import { styled } from '@material-ui/styles';
import {
  TreeItem,
  TreeView,
  treeItemClasses,
} from '@material-ui/lab';
import { Add } from '@material-ui/icons';
import ReactMarkdown from 'react-markdown';
import $ from "jquery"

const source = `
# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

---

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,  -- ---

"Smartypants, double quotes" and 'single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes


> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with +, -, *
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as 1.

Start numbering with offset:

57. foo
1. bar


## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)

## Plugins

[syntax plugins](https://www.npmjs.org/browse/keyword/markdown-it-plugin).


### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

> Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:
>
> Shortcuts (emoticons): :-) :-( 8-) ;)

see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.


### [Subscript](https://github.com/markdown-it/markdown-it-sub) / [Superscript](https://github.com/markdown-it/markdown-it-sup)

- 19^th^
- H~2~O


### [\<ins>](https://github.com/markdown-it/markdown-it-ins)

++Inserted text++


### [\<mark>](https://github.com/markdown-it/markdown-it-mark)

==Marked text==


### [Footnotes](https://github.com/markdown-it/markdown-it-footnote)

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


### [Definition lists](https://github.com/markdown-it/markdown-it-deflist)

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


### [Abbreviations](https://github.com/markdown-it/markdown-it-abbr)

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language

### [Custom containers](https://github.com/markdown-it/markdown-it-container)

::: warning
*here be dragons*
:::
`;

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{ width: 14, height: 14 }}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}


const StyledTreeItem = styled((props) => (
  <TreeItem {...props} />
))(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));


const PracticePedia = () => {
  const [selected, setSelected] = useState(["c1"]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleScroll = () => {
    let scrollTop = window.scrollY;
    let docHeight = document.body.offsetHeight;
    let winHeight = window.innerHeight;
    let scrollPercent = scrollTop / (docHeight - winHeight);
    let scrollPercentRounded = Math.round(scrollPercent * 100);
    console.log(scrollPercentRounded)
  }

  useEffect(() => {
    console.log(selected, selectedItem)
    $("#markdown").on('scroll', handleScroll);
    return () => {
      $("#markdown").on('scroll', handleScroll);
    }
  }, [selected, selectedItem])

  const data = [
    {
      "id": "c1",
      "label": "Category 1",
      "type": "category",
      "children": [
        {
          "id": "c1-1",
          "label": "Category 11",
          "type": "category",
          "children": [
            {
              "id": "c1-1-1",
              "label": "Category 111",
              "type": "category",
            },
            {
              "id": "c1-1-2",
              "label": "Category 112",
              "type": "category",
              "children": [
                {
                  "id": "o1-1-2",
                  "label": "Object 112",
                  "type": "object",
                  "object_type": "pdf"
                }
              ]
            }
          ]
        },
        {
          "id": "c1-2",
          "label": "Category 12",
          "type": "category",
        }
      ]
    },
  ]

  const TreeNode = ({ data }) => data.map(element => <React.Fragment key={element.id}>
    <StyledTreeItem nodeId={element.id} sx={{ my: 1 }} label={element.label} onClick={() => setSelectedItem(element)}>
      {element.children && <TreeNode data={element.children} />}

    </StyledTreeItem>
    {editMode && <IconButton color="primary" aria-label="add subcategory" component="span" size="small" sx={{ ml: "1px" }}>
      <Add />
    </IconButton>}

  </React.Fragment>)

  return (
    <>
      <Helmet>
        <title>Dashboard: PracticePedia</title>
      </Helmet>
      <Grid container sx={{ height: "100%" }}>
        <Grid item xl={4} lg={4} md={6} xs={12} sx={{ height: "100%" }}>
          <Card sx={{ backgroundColor: 'background.paper', height: "100%", overflowY: "scroll", padding: "20px" }}>
            <TreeView
              aria-label="customized"
              defaultExpanded={[]}
              defaultCollapseIcon={<MinusSquare />}
              defaultExpandIcon={<PlusSquare />}
              defaultEndIcon={<CloseSquare />}
              selected={selected}
              sx={{ flexGrow: 1, overflowY: 'auto', width: "100%" }}
              onNodeSelect={(event, nodeIds) => {
                setSelected(nodeIds);

              }}
            >
              <TreeNode data={data} />
            </TreeView>
          </Card>

        </Grid>
        <Grid item xl={8} lg={8} md={6} xs={12} sx={{ height: "100%" }}>
          {selectedItem && selectedItem.type === "object" && <iframe src="http://www.pdf995.com/samples/pdf.pdf" style={{ "width": "100%", "height": "100%", "border": 0 }}></iframe>}
          {selectedItem && selectedItem.type === "category" && <Card id="markdown" sx={{ p: 2, backgroundColor: 'background.paper', height: "100%", overflowY: "scroll" }}><ReactMarkdown source={source} /></Card>}
        </Grid>
      </Grid>
    </>
  );
};

export default PracticePedia;
