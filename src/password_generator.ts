export default class PasswordGenerator {
  private length: number;
  private _default_length: number = 8;
  private useUppercase: boolean
  private useLowercase: boolean
  private useNumbers: boolean
  private useSymbols: boolean
  private symbols: string
  constructor(options?: Options) {
    if (!options) {
      this.length = 8;
      this.useUppercase = true;
      this.useLowercase = true;
      this.useNumbers = true;
      this.useSymbols = false;
      this.symbols = '-_*+$|';
    } else {
      this.length = options.length ? options.length! : 8;
      this.useUppercase = options.useUppercase !== undefined ? options.useUppercase : true;
      this.useLowercase = options!.useLowercase !== undefined ? options.useLowercase : true;
      this.useNumbers = options!.useNumbers !== undefined ? options.useNumbers : true;
      this.useSymbols = !!options.useSymbols;
      if (options.customSymbols) {
        const customSymbols = options.customSymbols.join('');
        if (customSymbols.length != 0) {
          this.useSymbols = true;
          this.symbols = customSymbols;
        } else {
          this.useSymbols = false;
          this.symbols = '';
        }
      } else {
        this.symbols = '-_*+$|'
      }
    }
  }

  public generate(numPasswords?: number): string[] {
    let passwords: string[] = [];
    if (!numPasswords) {
      return [this._generate()]
    }

    for (let i = 0; i < numPasswords!; i++) {
      passwords.push(this._generate());
    }

    return passwords;
  }

  private _generate(): string {
    const charTypes = [];

    if (this.useUppercase) charTypes.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (this.useLowercase) charTypes.push('abcdefghijklmnopqrstuvwxyz');
    if (this.useNumbers) charTypes.push('0123456789');
    if (this.useSymbols) charTypes.push(this.symbols);

    let password = '';

    // 各charTypeから1文字ずつ選ぶ
    for (const charSet of charTypes) {
      const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
      password += randomChar;
    }

    // 残りの文字をランダムに選ぶ
    for (let j = password.length; j < this.length; j++) {
      const charSet = charTypes[Math.floor(Math.random() * charTypes.length)];
      const randomChar = charSet[Math.floor(Math.random() * charSet.length)];
      password += randomChar;
    }

    // パスワード内の文字をシャッフル
    return shuffleString(password);
  }

}

interface Options {
  length?: number
  useUppercase?: boolean
  useLowercase?: boolean
  useNumbers?: boolean
  useSymbols?: boolean
  customSymbols?: string[]
}

function shuffleString(str: string): string {
  const arr = str.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}
