import { Draw } from "./canvas.js";

const snapCode = document.querySelector(".snap-code");
const code = document.querySelector(".code");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const drw = new Draw(canvas,ctx)
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

export { snapCode , code, canvas, cvW, $lang, $fondo,$title, $by, $selectFontFamily, $checkBoxItalic, $ligatures, ctx, drw }