import { Draw } from "./lib/canvas.js";
import {  img, months } from './lib/util.js'

const snapCode = document.querySelector(".snap-code");
const code = document.querySelector(".code");
const canvas = document.querySelector("canvas");
const cvW = document.querySelector(".canvas-width");

// Inputs
const $title = document.getElementById("title");
const $by = document.getElementById("by");
const $lang = document.getElementById("languaje");
const $background = document.getElementById("background");
$background.value = localStorage.getItem('background') ?? ''

// Selects
const $selectIconNetwork = document.getElementById("select-icon-network");
const $selectFontFamily = document.querySelector("select");
$selectIconNetwork.value = localStorage.getItem('iconNetwork') ?? 'instagram'

const cvH = document.querySelector(".canvas-height");

// CheckBoxs
const $checkBoxItalic = document.querySelector(".italic");
const $ligatures = document.getElementById('font-ligatures')
const $fondo = document.getElementById('fondo')

const ctx = canvas.getContext("2d");
const cv = new Draw(canvas,ctx)
const btnRemove = document.getElementById('btn-remove')

$lang.value = localStorage.getItem('languaje') ?? "txt"
$lang.addEventListener('input', (e)=>{
  languaje = e.target.value
  localStorage.setItem('languaje',languaje)
  draw()
})

$fondo.addEventListener('change', draw)


let title = localStorage.getItem('title') ?? '';
let by = localStorage.getItem('by') ?? "you"


$title.value = title
$by.value = by
let fontSize = 42
let lineHeight = 1.4 * fontSize
let fondo = true;

$ligatures.checked =  Boolean(Number(localStorage.getItem('font-ligatures') ?? '1'))
canvas.style.fontFeatureSettings = $ligatures.checked ? "'ss01','cv02','cv27', 'ss03', 'ss04', 'ss05', 'ss06', 'ss07','ss09','ss20','cv31', 'calt', 'dlig','zero','onum'" : "normal";

$ligatures.addEventListener('click', ()=> {
  canvas.style.fontFeatureSettings = $ligatures.checked ? "'ss01','cv02','cv27', 'ss03', 'ss04', 'ss05', 'ss06', 'ss07','ss09','ss20','cv31', 'calt', 'dlig','zero','onum'" : "normal";
  localStorage.setItem('font-ligatures', Number($ligatures.checked))
  draw()
})

let padding = fontSize;
let fontFamily = localStorage.getItem('fontFamily') ?? "Cascadia Code";
$selectFontFamily.value = fontFamily
let paddingLineNumbers = 50
let languaje = $lang.value

const images = {
  iconCube: img("icon/cube.svg"),
  iconFolder: img("icon/folder.svg"),
  iconPlay: img("icon/play.svg"),
  iconAlert: img('icon/alert.svg'),
  background: img(localStorage.getItem('background') ?? './img/background.png'),
  iconNetwork: img(`icon/${ localStorage.getItem('iconNetwork') ?? 'instagram'}.svg`)
}

function draw() {
  code.innerHTML = localStorage.getItem("html") ?? `<div style="color: #abb2bf;background-color: #282c34;font-family: Cascadia Code, MonoLisa, Consolas, 'Courier New', monospace;font-weight: normal;font-size: 14px;line-height: 19px;white-space: pre;"><div><span style="color: hsl(${Math.random()*360},100%,70%);font-style: italic;">Paste your code from VSCode</span></div></div>`;
  
  const bgColor = getComputedStyle(document.querySelector('code>div')).backgroundColor
  console.log()
  let isDark = bgColor.match(/\d+/g).reduce((ac, v)=>ac + Number(v),0) / 3 < 127;

  console.log(isDark)
  const rows = code.querySelectorAll("div > div, div > br");
  const bgf = new Set()
  let colsMax = new Set()
  
  let heightCode = rows.length * lineHeight;
  rows.forEach((row)=>{
    ctx.font = `42px ${fontFamily}`;
    bgf.add(ctx.measureText(row.innerText).width)
    colsMax.add(row.innerText.length)
  })
  colsMax = Math.max(...colsMax)
  const bgfMax = Math.max(...bgf)
  
  ctx.font = `42px ${fontFamily}`;
  let wLH = ctx.measureText(String(rows.length)).width
  
  // 🫧 Canvas Dimensitions
  canvas.width = padding*2 + (paddingLineNumbers*2 + wLH) * 2 + bgfMax;
  canvas.width = canvas.width < 1600 ? 1600 : canvas.width;
  canvas.height = (padding*2) + heightCode + 200;
  
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

  ctx.shadowColor = "rgba(0, 0, 0, .2)";
  ctx.shadowBlur = padding;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = bgColor;
  cv.rectRound(
    padding,
    padding,
    canvas.width - padding * 2,
    canvas.height - padding * 2,
    30
  ).fill();
  ctx.filter = 'none';

  // 🫧 Bar Status
  let heightStatusBar = lineHeight*1.2
  ctx.shadowBlur = 0
  ctx.fillStyle = "rgba(0,0,0,.1)"
  cv.fillRectRoundedBottom(
    padding, 
    canvas.height-padding-heightStatusBar, 
    canvas.width-padding*2, 
    heightStatusBar,
    32
  )

  ctx.strokeStyle = isDark ? "rgba(255,255,255,.1)" : 'rgba(0,0,0,.2)';
  ctx.lineWidth = 2;
  cv.rectRound(
    padding+1,
    padding+1,
    canvas.width - (padding * 2)-2,
    canvas.height - (padding * 2) -2,
    32
  ).stroke();

  ctx.shadowBlur = 0;

  // circle
  cv.circle(padding + 60, padding + 60, 16, "#F76452").fill();
  cv.circle(padding + 120, padding + 60, 16, "#fdbf2c").fill();
  cv.circle(padding + 180, padding + 60, 16, "#1ecf37").fill();

  const cod = { x: padding + (paddingLineNumbers*2)+wLH, y: padding + 120 };


  // 🫧 Icon Folder
  let size = 50
  ctx.filter = isDark ? 'none' : 'invert(100)'
  ctx.drawImage(images.iconFolder, padding+240, padding+60-(size/2),size,size);
  ctx.filter = 'none'

  // 🫧 Title
  ctx.textBaseline = "middle";
  ctx.font = `42px ${fontFamily}`;
  // ctx.fillStyle = `hsla(${Math.random()*360},100%,${isDark ? '90%,.7' : '10%,.7'})`
  ctx.fillStyle = isDark ? `oklch(83% 0.1 ${Math.random()*360}deg / 0.5)` : '#00000099'
  ctx.fillText(title, padding + 310, padding+60)

  ctx.filter = isDark ? 'none' : 'invert(100)'
  ctx.drawImage(images.iconCube, canvas.width-padding-90, padding+60-(size/2),size,size);
  ctx.drawImage(images.iconPlay, canvas.width-padding-170, padding+60-(size/2),size,size);
  ctx.filter = 'none'

  ctx.textBaseline = "top";
  rows.forEach((row, i) => {
    
    // line Numbers
    ctx.textAlign = "right";
    ctx.fillStyle = isDark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.4)';
    ctx.font = `42px ${fontFamily}`;
    ctx.fillText(
      i+1,
      padding + paddingLineNumbers + wLH,
      i*lineHeight+cod.y
    );

    
   

    row = row.querySelectorAll("span");

    ctx.textAlign = "left";

    // ✏️ Indentation
    if (row[0] !== undefined && /^(\s\s)+/.test(row[0].textContent)) {
      let r = ctx.measureText("..").width;
      let text = [...row[0].textContent.replaceAll(/\s/g,' ')];
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
      ctx.fillStyle="rgb(255,255,255,0.1)"
      cv.rectRound(
        canvas.width-padding-20,
        cod.y + (i * lineHeight) + (lineHeight/4) ,
        10,
        lineHeight*0.5,
        5
      ).fill();
    }

    let left = cod.x
    row.forEach((span, i2) => {
      ctx.textAlign = "left";

      let fg = getComputedStyle(span);

      if ($checkBoxItalic.checked) {
        
        ctx.font = `${fg.fontWeight} ${fg.fontStyle} 42px ${fontFamily}`;
      } else {

        ctx.font = `${fg.fontWeight} 42px ${fontFamily}`;
      }

      ctx.fillStyle = "rgba(255,255,255,.03)";
      
      let x = left 
      let y = cod.y + (i * lineHeight) 
      ctx.fillText(
        span.textContent.replaceAll(/\s/g, "•"),
        x,
        y
      );
      
      ctx.fillStyle = fg.color;
      ctx.fillText(
        span.textContent,
        x,
        y
      );
      left += ctx.measureText(span.textContent).width 
    });
  });




  // 🫧 Bar Status Info
  ctx.textBaseline = 'middle'
  ctx.fillStyle = isDark ? "rgb(255,255,255)" : "rgb(0,0,0)"
  ctx.font = '38px DM Sans'
  ctx.globalAlpha = 0.4

  let today = new Date() 
  ctx.fillText(`∿ ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}    Ln ${rows.length}, Col ${colsMax}`, padding + 30, canvas.height - padding-heightStatusBar/2)

  ctx.filter = isDark ? 'none' : 'invert(100)'
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
  cvW.textContent = "Width: " + canvas.width
  cvH.textContent = "Height: " + canvas.height

  localStorage.setItem("html", code.innerHTML)
}

const btnPaste = document.querySelector(".btn-paste");
btnPaste.addEventListener("click", async () => {
  const clipboardItems = await navigator.clipboard.read();

  for (const clipboardItem of clipboardItems) {
    if (clipboardItem.types.includes("text/html")) {
      const htmlBlob = await clipboardItem.getType("text/html");
      const htmlText = await htmlBlob.text();
      localStorage.setItem('html', htmlText)
    }
  }

  draw();
});

$selectFontFamily.addEventListener('change', (e) => {
  localStorage.setItem('fontFamily', e.target.value)
  fontFamily = e.target.value
  draw()
})
window.addEventListener('load',draw)
$title.addEventListener('input', (e)=>{
  title = e.target.value
  localStorage.setItem('title',title)
  draw()
})
$by.addEventListener('input', (e)=>{
  by = e.target.value
  localStorage.setItem('by',by)
  draw()
});
$background.addEventListener('keyup', (e)=>{
  console.log(e)
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










