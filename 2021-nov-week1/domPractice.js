window.onload = function() {
  const h1 = document.createElement("h1");
  const h1Text = document.createTextNode("Hello");
  h1.appendChild(h1Text);
  document.body.appendChild(h1);
  const p = document.createElement("p");
  p.appendChild(document.createTextNode("abcdefg"));
  h1.ownerDocument.body.appendChild(p);
  
  console.log("h1이 속해있는 document는? " + h1.ownerDocument);
  console.log("h1의 ownerDocument는 document인가요? : " + (h1.ownerDocument === document));
  console.log("h1과 p의 ownerDocument는 같다? : " + (h1.ownerDocument.ownerDocument === p.ownerDocument.ownerDocument));
}