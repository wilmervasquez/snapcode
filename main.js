import { Draw } from "./lib/canvas.js";
import { img, months } from './lib/util.js'

const snapCode = document.querySelector(".snap-code");
const $selectFontFamily = document.querySelector("select");
const code = document.querySelector(".code");
const canvas = document.querySelector("canvas");
const cvW = document.querySelector(".canvas-width");
const $title = document.querySelector(".title");
const $by = document.querySelector(".by");
const cvH = document.querySelector(".canvas-height");
const $checkBoxItalic = document.querySelector(".italic");
const ctx = canvas.getContext("2d");
const cv = new Draw(canvas,ctx)
const lang = document.querySelector(".lang");
lang.value = localStorage.getItem('languaje') ?? "txt"
lang.addEventListener('input', (e)=>{
  languaje = e.target.value
  localStorage.setItem('languaje',languaje)
  draw()
})

const images = {
  iconInstagram: img("icon/instagram.svg"),
  iconCube: img("icon/cube.svg"),
  iconAlert: img('icon/alert.svg'),
  background: img('https://img.pikbest.com/origin/09/34/08/86cpIkbEsTCpk.jpg!bw700')

}

code.innerHTML = localStorage.getItem("html") 

let title = localStorage.getItem('title') ?? '';
let by = localStorage.getItem('by') ?? "you"
$title.value = title
$by.value = by
let fontSize = 42
let lineHeight = 1.4 * fontSize
let fondo = true;
let padding = fontSize;
let fontFamily = "Source Code Pro"
let paddingLineNumbers = 50
let languaje = lang.value

function draw() {

  fontFamily =  $selectFontFamily.value
  
  const bgColor = getComputedStyle(document.querySelector('code>div')).backgroundColor
  snapCode.style.background = bgColor
  document.body.style.backgroundColor = bgColor

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
  canvas.width = padding*2 + (paddingLineNumbers*2 + wLH) * 2 + bgfMax ;
  canvas.height = (padding*2) + heightCode + 190;

  if (fondo) {
    cv.setBackground(bgColor)
    cv.setBackground('rgba(0,0,0,.2)')

    ctx.drawImage(
      images.background, 
      0,
      0,
      canvas.width,
      canvas.height
    )
  }


  ctx.fillStyle = bgColor;
  ctx.shadowColor = "rgba(0, 0, 0, .2)";
  ctx.shadowBlur = padding;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  cv.drawRoundedRect(
    padding,
    padding,
    canvas.width - padding * 2,
    canvas.height - padding * 2,
    30
  );

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

  ctx.strokeStyle = "rgba(255,255,255,.1)";
  ctx.lineWidth = 2;
  cv.drawRoundedStroke(
    padding+1,
    padding+1,
    canvas.width - (padding * 2)-2,
    canvas.height - (padding * 2) -2,
    32
  );

  ctx.shadowBlur = 0;

  // circle
  cv.fillCircle(padding + 60, padding + 60, 16, "#F76452");
  cv.fillCircle(padding + 120, padding + 60, 16, "#fdbf2c");
  cv.fillCircle(padding + 180, padding + 60, 16, "#1ecf37");
  console.dir(ctx)
  


  const cod = { x: padding + (paddingLineNumbers*2)+wLH, y: padding + 120 };

  // 🫧 Title
  ctx.textBaseline = "middle";
  ctx.font = `42px Comic Sans MS`;
  ctx.fillStyle = "rgba(255,255,255,.5)"
  ctx.fillText(title, padding + 240, padding+60)
  ctx.drawImage(images.iconCube, canvas.width-padding-90, padding+60-25,50,50);

  ctx.textBaseline = "top";
  rows.forEach((row, i) => {
    
    // line Numbers
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,.2)";
    ctx.font = `42px ${fontFamily}`;
    ctx.fillText(
      i+1,
      padding + paddingLineNumbers + wLH,
      i*lineHeight+cod.y
    );

    
   

    row = row.querySelectorAll("span");

    ctx.textAlign = "left";

    // FIXME Aug 12: Crear mas pasos
    if (row[0] !== undefined && /\s/.test(row[0].textContent)) {
      let r = ctx.measureText("..").width;
      let text = row[0].textContent;
      let gj = text.match(/\s/g);
      ctx.fillStyle = "rgba(255,255,255,.1)";

      for (let j = 0, k = 0; j < gj.length; j += 2) {
        ctx.fillRect(
          cod.x + r * k,
          lineHeight * i + cod.y- 6,
          2,
          lineHeight
        );
        k++;
      }
    }

    if(Math.random() >= 0.5) {
      ctx.fillStyle="rgb(255,255,255,0.1)"
      cv.drawRoundedRect(
        canvas.width-padding-20,
        cod.y + (i * lineHeight) + (lineHeight/4) ,
        10,
        lineHeight*0.5,
        5
      )
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




  // 🫧 By Instagram
  ctx.textBaseline = 'middle'
  ctx.fillStyle = "rgba(255,255,255,0.6)"
  ctx.font = '38px DM Sans'

  let today = new Date() 
  ctx.fillText(`▶ ${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}    Ln ${rows.length}, Col ${colsMax}`, padding + 30, canvas.height - padding-heightStatusBar/2)
  ctx.textAlign = 'right'
  ctx.drawImage(
    images.iconInstagram, 
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
  ctx.fillText( by, canvas.width - padding - ctx.measureText(languaje).width-150, canvas.height - padding-heightStatusBar/2)
  ctx.fillText(
    languaje, 
    canvas.width - padding - 100, 
    canvas.height - padding-heightStatusBar/2
  )


  
  // 👁️ Show Info Canvas
  cvW.textContent = "Width: " + canvas.width
  cvH.textContent = "Height: " + canvas.height

  localStorage.setItem("html", code.innerHTML)
}

draw();

const btnPaste = document.querySelector(".btn-paste");
btnPaste.addEventListener("click", async () => {
  const clipboardItems = await navigator.clipboard.read();

  for (const clipboardItem of clipboardItems) {
    if (clipboardItem.types.includes("text/html")) {
      const htmlBlob = await clipboardItem.getType("text/html");
      const htmlText = await htmlBlob.text();
      code.innerHTML = htmlText;
    }
  }
  draw();
});

$selectFontFamily.addEventListener('change', draw)
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
// JavaScript All array methods Cheatsheet

// @amazingfarooqq









$checkBoxItalic.addEventListener('click', draw)












