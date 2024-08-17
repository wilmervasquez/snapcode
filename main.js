
import { Draw } from "./lib/canvas.js";
import {  fontFeatureSettings, images, months } from './lib/util.js'

const snapCode = document.querySelector(".snap-code");
const code = document.querySelector(".code");
const canvas = document.querySelector("canvas");

// Inputs
const app = {
  by: document.getElementById("by"),
  cvW: document.querySelector(".canvas-width"),
  cvH: document.querySelector(".canvas-height")
}

const $title = document.getElementById("title");

const $lang = document.getElementById("languaje");
const $background = document.getElementById("background");
$background.value = localStorage.getItem('background') ?? ''

// Selects
const $selectIconNetwork = document.getElementById("select-icon-network");
const $selectFontFamily = document.querySelector("select");
$selectIconNetwork.value = localStorage.getItem('iconNetwork') ?? 'instagram'


// CheckBoxs
const $checkBoxItalic = document.querySelector(".italic");
const $ligatures = document.getElementById('font-ligatures')
const $fondo = document.getElementById('fondo')

const ctx = canvas.getContext("2d");
const drw = new Draw(canvas,ctx)
const btnRemove = document.getElementById('btn-remove')

$lang.value = localStorage.getItem('languaje') ?? "txt"
$lang.addEventListener('input', (e)=>{
  languaje = e.target.value
  localStorage.setItem('languaje',languaje)
  draw()
})

$fondo.addEventListener('change', draw)

const codeSpace = {
  linesInPlainText: [],
  comment: {
    match: /\/\/ /,
    replace: "↝ ",
    startsWith: "//"
  }
}


let title = localStorage.getItem('title') ?? '';
let by = localStorage.getItem('by') ?? "you"

const config = {
  borderRadius: 30,
  fontFeatureSettings: fontFeatureSettings.CascadiaCode
}
$title.value = title
app.by.value = by
let fontSize = 42
let lineHeight = 1.4 * fontSize
let fondo = true;

$ligatures.checked =  Boolean(Number(localStorage.getItem('font-ligatures') ?? '1'))
canvas.style.fontFeatureSettings = $ligatures.checked ? config.fontFeatureSettings : "normal";

$ligatures.addEventListener('click', ()=> {
  canvas.style.fontFeatureSettings = $ligatures.checked ? config.fontFeatureSettings : "normal";
  localStorage.setItem('font-ligatures', Number($ligatures.checked))
  draw()
})

let padding = 30;
let fontFamily = localStorage.getItem('fontFamily') ?? "Cascadia Code";
$selectFontFamily.value = fontFamily
updateFontFeatureSettings()
let paddingLineNumbers = 50
let languaje = $lang.value




function loadStructCodeSpace() {
  try {
    code.innerHTML = localStorage.getItem("html") ?? `<div style="color: #abb2bf;background-color: #282c34;font-family: Cascadia Code, MonoLisa, Consolas, 'Courier New', monospace;font-weight: normal;font-size: 14px;line-height: 19px;white-space: pre;"><div><span style="color: hsl(${Math.random()*360},100%,70%);font-style: italic;">Paste your code from VSCode</span></div></div>`;
    codeSpace.bgColor = getComputedStyle(document.querySelector('code>div')).backgroundColor
    codeSpace.isDark = codeSpace.bgColor.match(/\d+/g).reduce((ac, v)=>ac + Number(v),0) / 3 < 127;
  
    let rows = []
    let linesInPlainText = []
    let $rows = code.querySelectorAll("div > div, div > br");
  
    $rows.forEach(($line) => {
      let line = []
      linesInPlainText.push($line.innerText)
      $line.childNodes.forEach(($token) => {
        let $lineComputedStyle = getComputedStyle($token);
        if ($token.innerText.startsWith(codeSpace.comment.startsWith)) {
          line.push({
            textContent: codeSpace.comment.replace,
            fontStyle: 'normal',
            fontWeight: $lineComputedStyle.fontWeight,
            color: $lineComputedStyle.color,
       
  
          })
          line.push({
            textContent: $token.innerText.replace(codeSpace.comment.match, ""),
            fontStyle: 'normal',
            fontWeight: $lineComputedStyle.fontWeight,
            color: $lineComputedStyle.color,
          })
        } else {
  
          line.push({
            textContent: $token.innerText,
            fontStyle: $lineComputedStyle.fontStyle,
            fontWeight: $lineComputedStyle.fontWeight,
            color: $lineComputedStyle.color,
          })
        }
      })
      rows.push(line)
    });
  
    codeSpace.rows = rows
    codeSpace.linesInPlainText = linesInPlainText;
  } catch (error) {
    
  }
}
loadStructCodeSpace()

function draw() {
  const widthOfLines = new Set()
  let colsMax = new Set()
  
  drw.setFont(fontSize, fontFamily)

  let heightCode = codeSpace.rows.length * lineHeight;
  codeSpace.linesInPlainText.forEach((textContent )=>{
    widthOfLines.add(ctx.measureText(textContent).width)
    colsMax.add(textContent.length)
  })

  colsMax = Math.max(...colsMax)
  const maxWidthOfCodeSpace = Math.max(...widthOfLines)
  
  let wLH = ctx.measureText(String(codeSpace.rows.length)).width
  
  // 🫧 Canvas Dimensitions
  canvas.width = padding *2 + (paddingLineNumbers*2 + wLH) * 2 + maxWidthOfCodeSpace;
  canvas.width = canvas.width < 1600 ? 1600 : canvas.width;
  canvas.height = (padding*2) + heightCode + 200;
  
  drw.setFont(fontSize, fontFamily)
  // return
  if ($fondo.checked) {
    ctx.drawImage(
      images.background, 
      0,
      0,
      canvas.width,
      canvas.height
    )
  }

  drw.setShadow("hsl(0,0%,0%, 0.3)", padding, 0 ,0)
 
  ctx.fillStyle = codeSpace.bgColor;
  drw.rectRound(
    padding,
    padding,
    canvas.width - padding * 2,
    canvas.height - padding * 2,
    config.borderRadius
  ).fill();
  ctx.filter = 'none';

  // 🫧 Bar Status
  let heightStatusBar = lineHeight*1.2
  ctx.shadowBlur = 0
  ctx.fillStyle = "rgba(0,0,0,.1)"
  drw.fillRectRoundedBottom(
    padding, 
    canvas.height-padding-heightStatusBar, 
    canvas.width-padding*2, 
    heightStatusBar,
    config.borderRadius + 2
  )

  ctx.strokeStyle = codeSpace.isDark ? "rgba(255,255,255,.1)" : 'rgba(0,0,0,.2)';
  ctx.lineWidth = 2;
  drw.rectRound(
    padding+1,
    padding+1,
    canvas.width - (padding * 2)-2,
    canvas.height - (padding * 2) -2,
    config.borderRadius
  ).stroke();

  ctx.shadowBlur = 0;

  // circle
  drw.circle(padding + 60, padding + 60, 16, "#F76452").fill();
  drw.circle(padding + 120, padding + 60, 16, "#fdbf2c").fill();
  drw.circle(padding + 180, padding + 60, 16, "#1ecf37").fill();

  const cod = { x: padding + (paddingLineNumbers*2)+wLH, y: padding + 120 };


  // 🫧 Icon Folder
  let size = 50
  ctx.filter = codeSpace.isDark ? 'none' : 'invert(100)'
  ctx.drawImage(images.iconFolder, padding+240, padding+60-(size/2),size,size);
  ctx.filter = 'none'

  // 🫧 Title
  ctx.textBaseline = "middle";

  ctx.fillStyle = codeSpace.isDark ? `rgba(255,255,255,0.5)` : '#00000099'
  ctx.fillText(title, padding + 310, padding+60)

  ctx.filter = codeSpace.isDark ? 'none' : 'invert(100)'
  ctx.drawImage(images.iconCube, canvas.width-padding-90, padding+60-(size/2),size,size);
  ctx.drawImage(images.iconPlay, canvas.width-padding-170, padding+60-(size/2),size,size);
  ctx.filter = 'none'

  ctx.textBaseline = "top";
  codeSpace.rows.forEach((line, i) => {
    
    // resaltado
    // let rest = lineHeight/6
    // if (i == 5 || i == 8) {
    //   ctx.fillStyle = 'hsla(135,100%,70%,0.1)'
    //   ctx.fillRect(padding, cod.y + (i*lineHeight)-rest, canvas.width - (padding * 2), lineHeight)
    //   ctx.fillStyle = 'hsla(135,100%,70%,0.5)'
    //   ctx.fillRect(padding, cod.y + (i*lineHeight)-rest, 6, lineHeight)
    // }
    // if (i == 16 || i == 7) {
    //   ctx.fillStyle = 'hsla(5,100%,70%,0.1)'
    //   ctx.fillRect(padding, cod.y + (i*lineHeight)-rest, canvas.width - (padding * 2), lineHeight)
    //   ctx.fillStyle = 'hsla(5,100%,70%,0.8)'
    //   ctx.fillRect(padding, cod.y + (i*lineHeight)-rest, 6, lineHeight)
    // }

    // line Numbers
    ctx.textAlign = "right";
    ctx.fillStyle = codeSpace.isDark ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.4)';
    drw.setFont(fontSize, fontFamily);
    ctx.fillText(
      i+1,
      padding + paddingLineNumbers + wLH,
      i*lineHeight+cod.y
    );

    ctx.textAlign = "left";

    // ✏️ Indentation
    if (line[0] !== undefined && /^(\s\s)+/.test(line[0].textContent)) {
      let r = ctx.measureText("..").width;
      let text = [...line[0].textContent.replaceAll(/\s/g,' ')];
      // let gj = text.match(/\s/g);
      ctx.fillStyle = "rgba(255,255,255,.1)";

      let tab = 0;
      let k = 0
      while(text[tab]==' ') {
        ctx.fillRect(
          cod.x + r * k,
          lineHeight * i + cod.y- 6,
          2,
          lineHeight
        );
        k++
        tab += 2
      }
    }

    if(Math.random() >= 0.5) {
      ctx.fillStyle = `hsla(${Math.random()*360},100%,90%,0.1)`
      drw.rectRound(
        canvas.width-padding-20,
        cod.y + (i * lineHeight)  -3,
        10,
        lineHeight*0.75,
        5
      ).fill();
    }

    let left = cod.x
    line.forEach(({ textContent, fontStyle, fontWeight, color, shadowColor }, i2) => {
      ctx.textAlign = "left";

      
 
      if ($checkBoxItalic.checked) {
        
        drw.setFont(fontSize,fontFamily, fontWeight, fontStyle);
      } else {
        drw.setFont(fontSize,fontFamily, fontWeight);
      }

      
      let x = left 
      let y = cod.y + (i * lineHeight) 
      
      
      ctx.fillStyle = "rgba(255,255,255,.03)";

      let text = textContent.replace(/\s/g, " ");

      let txtM = text.replace(/\s/g, "•")
      ctx.fillText( txtM, x, y );
      
      if (shadowColor) drw.setShadow(shadowColor, 14, 0 ,0)
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      drw.setShadow(shadowColor, 0, 0 ,0)

      left += ctx.measureText(text).width 
    });
  });




  // 🫧 Bar Status Info
  ctx.textBaseline = 'middle'
  ctx.fillStyle = codeSpace.isDark ? "rgb(255,255,255)" : "rgb(0,0,0)"
  drw.setFont(36, 'DM Sans')
  ctx.globalAlpha = 0.4

  let today = new Date() 
  ctx.fillText(`∿ ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}    Ln ${codeSpace.rows.length}, Col ${colsMax}`, padding + 30, canvas.height - padding-heightStatusBar/2)

  ctx.filter = codeSpace.isDark ? 'none' : 'invert(100)'
  ctx.drawImage(
    images.iconNetwork, 
    canvas.width - padding - paddingLineNumbers-ctx.measureText(by).width-ctx.measureText(languaje).width-145, 
    canvas.height-padding - (heightStatusBar/4)*3-4, 
    42,
    42
  )
  ctx.drawImage(
    images.iconAlert, 
    canvas.width - padding - paddingLineNumbers-18, 
    canvas.height-padding - (heightStatusBar/4)*3-4, 
    42,
    42
  )
  ctx.filter = 'none'

  ctx.textAlign = 'right'
  ctx.fillText( by, canvas.width - padding - ctx.measureText(languaje).width-150, canvas.height - padding-heightStatusBar/2)
  ctx.fillText(
    languaje, 
    canvas.width - padding - 100, 
    canvas.height - padding-heightStatusBar/2
  )
  ctx.globalAlpha = 1

  // 👁️ Show Info Canvas
  app.cvW.textContent = "Width: " + canvas.width
  app.cvH.textContent = "Height: " + canvas.height
}

const btnPaste = document.querySelector(".btn-paste");
btnPaste.addEventListener("click", async () => {
  const clipboardItems = await navigator.clipboard.read();

  for (const clipboardItem of clipboardItems) {
    if (clipboardItem.types.includes("text/html")) {
      const htmlBlob = await clipboardItem.getType("text/html");
      const htmlText = await htmlBlob.text();
      localStorage.setItem('html', htmlText)
      loadStructCodeSpace()
    }
  }

  draw();
});

function updateFontFeatureSettings() {
  switch (fontFamily) {
    case 'mls': canvas.style.fontFeatureSettings =fontFeatureSettings.MonoLisa; break;
    case 'Cascadia Code': canvas.style.fontFeatureSettings = fontFeatureSettings.CascadiaCode; break;
    case 'Fira Code': canvas.style.fontFeatureSettings = fontFeatureSettings.FiraCode; break;
  }
}

$selectFontFamily.addEventListener('change', (e) => {
  localStorage.setItem('fontFamily', e.target.value)
  fontFamily = e.target.value
  updateFontFeatureSettings()
  draw()
})
window.addEventListener('load',draw)
$title.addEventListener('input', (e)=>{
  title = e.target.value
  localStorage.setItem('title',title)
  draw()
})
app.by.addEventListener('input', (e)=>{
  by = e.target.value
  localStorage.setItem('by',by)
  draw()
});
$background.addEventListener('keyup', (e)=>{
  if(e.key === 'Enter'){ 
    localStorage.setItem('background', e.target.value)
    images.background.src = e.target.value
    images.background.onload = () => draw();
  }
});

$selectIconNetwork.addEventListener('change', (e)=>{
  images.iconNetwork.src = `icon/${e.target.value}.svg`
  localStorage.setItem('iconNetwork', e.target.value )
  images.iconNetwork.onload = () => draw();
});

$checkBoxItalic.addEventListener('click', draw)

btnRemove.addEventListener('click', () => {
  localStorage.removeItem('html')
  draw()
})




