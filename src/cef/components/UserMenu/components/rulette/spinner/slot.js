import spin from "../../../../../assets/sounds/roulette-single-spin.mp3";

const frame = {
  index: 0,
  x: 0,
  y: 0,
  size: 600,
  frame: 1000 / 38,
  lastUpdate: 0,
  next() {
    if (frame.lastUpdate > Date.now()) return;
    this.lastUpdate = Date.now() + this.frame;
    this.index++;
    if (this.index >= 38) this.index = 0;
    this.y = Math.floor(this.index / 19) * this.size;
    this.x = (this.index % 19) * this.size;
  },
};

export default class Slot {
  constructor(ctx, item, size, offset) {
    this.isLeftOfCenter = false
    this.isFirstSound = true
    this.ctx = ctx;
    this.size = size;
    this.color = item.color;
    this.posX = offset;
    (this.item = {
      width: this.size,
      height: this.size * 0.91,
      bottomLineHeight: this.size * 0.05,
      rarityImg: item.rarityImg,
      dotRadius: this.size * 0.03,
      img: item.img,
      size: this.size - this.padding * 2,
      y: this.padding,
    }),
      (this.inMove = false);
  }

  playSound() {
    const audio = new Audio(spin);
    audio.volume = 0.4;
    audio.play();
    this.isLeftOfCenter = false
    this.isFirstSound = false
  }

  draw() {
    this.ctx.beginPath();

    let gradient = this.ctx.createLinearGradient(
      this.posX,
      this.item.height * 0.244,
      this.posX,
      this.item.height * 0.465 + this.item.height * 0.244
    );
    gradient.addColorStop(0, "transparent");
    gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "transparent");
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(
      this.posX,
      this.item.height * 0.244,
      this.item.width / 100,
      this.item.height * 0.465
    );

    this.ctx.fill();

    this.ctx.drawImage(
      this.item.rarityImg,
      this.posX,
      0,
      this.item.width,
      this.item.height
    );
    this.ctx.drawImage(
      this.item.img,
      this.posX + (this.item.width - this.item.height / 1.75) / 2,
      this.item.height / 2.8,
      this.item.height / 1.75,
      this.item.height / 1.75
    );
    
  }

  borderBottomRadius(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
  }

  borderRadius(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
  }
  fixPos(fix) {
    this.x -= fix;
  }

  moveX(speed) {
    this.inMove = speed > 50;
    this.posX -= speed;
    this.posX < this.item.width * 1.5 && this.isFirstSound === true ? this.playSound() : null

  }

  imgLocalOffset() {
    return this.posX + this.item.width;
  }
  canDelete() {
    return this.posX < -this.size;
  }

  localCenter() {
    return this.posX + (this.size - this.padding) / 2;
  }
}
