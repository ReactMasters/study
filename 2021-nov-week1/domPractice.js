window.onload = function() {
  const h1 = document.createElement("h1");
  const h1Text = document.createTextNode("h1: Hello");
  h1.appendChild(h1Text);
  document.body.appendChild(h1);

  // Document, ownerDocument
  const p1 = document.createElement("p");
  p1.appendChild(document.createTextNode("p1: abcdefg"));
  h1.ownerDocument.body.appendChild(p1);

  const p2 = document.createElement("p");
  p2.appendChild(document.createTextNode("p2: bye"));
  document.body.appendChild(p2);

  // If the given child is a reference to an existing node in the document,
  // appendChild() moves it from its current position to the new position.
  // So there is no requirement to remove the node from its parent node
  //  before appending it to some other node.
  document.body.appendChild(p1);
  
  console.log("h1이 속해있는 document는? " + h1.ownerDocument);
  console.log("h1의 ownerDocument는 document인가요? : " + (h1.ownerDocument === window.document));
  console.log("h1과 p의 ownerDocument는 같다? : " + (h1.ownerDocument.ownerDocument === p1.ownerDocument.ownerDocument));

  // NodeList
  const nodeList = document.querySelectorAll("p");
  console.log("querySelectorAll은 NodeList를 리턴합니다: ", JSON.stringify(nodeList));
  nodeList.item(0).style = "color: blue;";
  nodeList[1].style = "color: red;";
  
  // Attr
  console.log("빨간 p의 id attr? ", nodeList[1].getAttribute("id"));
  const div1 = document.getElementById("div1");
  console.log("div1의 style은? ", div1.getAttribute("style"));
  const div1IdAttr = div1.getAttributeNode("id");
  console.log(div1IdAttr.value === "div1");
}