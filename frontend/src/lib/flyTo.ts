/* flyTo – GPU‑accelerated flight from any card to its budget row */
export function flyTo(card: HTMLElement, target: HTMLElement) {
  const start   = card.getBoundingClientRect();
  const endBox  = target.getBoundingClientRect();

  /* centre‑to‑centre delta */
  const dx = endBox.left + endBox.width  / 2 - (start.left + start.width  / 2);
  const dy = endBox.top  + endBox.height / 2 - (start.top  + start.height / 2);

  /* ghost clone */
  const ghost = card.cloneNode(true) as HTMLElement;
  ghost.style.cssText = `
    position:fixed; left:${start.left}px; top:${start.top}px;
    width:${start.width}px; height:${start.height}px;
    margin:0; z-index:3000; pointer-events:none;
    transform-origin:center center;
  `;
  document.body.appendChild(ghost);

  /* keyframe using translate for GPU compositing */
  ghost.animate(
    [
      { transform: "translate(0,0) scale(1)",  opacity: 1 },
      { transform: `translate(${dx}px,${dy}px) scale(0.35)`, opacity: 0.6 }
    ],
    { duration: 550, easing: "cubic-bezier(.22,1,.36,1)" }
  ).onfinish = () => ghost.remove();
}
