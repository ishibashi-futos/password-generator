import PasswordGenerator from "./password_generator"

describe("password generate test", () => {
  test('when it is invoked with no parameters ok', () => {
    const g = new PasswordGenerator();
    expect((g as any).length).toEqual(8);
    expect((g as any).useUppercase).toBeTruthy();
    expect((g as any).useLowercase).toBeTruthy();
    expect((g as any).useNumbers).toBeTruthy();
    expect((g as any).useSymbols).toBeFalsy();
    expect((g as any).symbols).toBe('-_*+$|');
  });

  test('when it is invoked with empty parameters ok', () => {
    const g = new PasswordGenerator({});
    expect((g as any).length).toEqual(8);
    expect((g as any).useUppercase).toBeTruthy();
    expect((g as any).useLowercase).toBeTruthy();
    expect((g as any).useNumbers).toBeTruthy();
    expect((g as any).useSymbols).toBeFalsy();
    expect((g as any).symbols).toBe('-_*+$|');
  });

  test('when give all options', () => {
    const g = new PasswordGenerator({
      length: 10,
      useUppercase: false,
      useLowercase: false,
      useNumbers: false,
      useSymbols: true,
      customSymbols: [
        "+",
        "?",
        "!"
      ]
    });
    expect((g as any).length).toEqual(10);
    expect((g as any).useUppercase).toBeFalsy();
    expect((g as any).useLowercase).toBeFalsy();
    expect((g as any).useNumbers).toBeFalsy();
    expect((g as any).useSymbols).toBeTruthy();
    expect((g as any).symbols).toBe('+?!');
  });

  test('only A-Z password', () => {
    const g = new PasswordGenerator({
      useUppercase: true,
      useLowercase: false,
      useNumbers: false,
      useSymbols: false,
    });

    const password = g.generate()[0];

    expect(password).toMatch(/^[A-Z]+$/);
  });

  test('only a-z password', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: true,
      useNumbers: false,
      useSymbols: false,
    });

    const password = g.generate()[0];

    expect(password).toMatch(/^[a-z]+$/);
  });

  test('only 0-9 password', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: false,
      useNumbers: true,
      useSymbols: false,
    });

    const password = g.generate()[0];

    expect(password).toMatch(/^[0-9]+$/);
  });

  test('when use symbols', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: false,
      useNumbers: true,
      useSymbols: true,
    });

    const password = g.generate()[0];

    expect(password).toMatch(/^[-_*+$|\d]+$/)
  });

  test('when use custom symbols', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: false,
      useNumbers: true,
      useSymbols: true,
      customSymbols: ['@', '?', '#', '%']
    });

    const password = g.generate()[0];

    expect(password).not.toMatch(/^[-_*+$|]+$/);
    expect(password).toMatch(/^[@?#%\d]+$/);
  });

  test('when use custom symbols enable useSymbols flag', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: false,
      useNumbers: true,
      useSymbols: false,
      customSymbols: ['@', '?', '#', '%']
    });

    const password = g.generate()[0];

    expect((g as any).useSymbols).toBeTruthy();
    expect(password).toMatch(/^[@?#%\d]+$/);
  });

  test('useSymbols flag should be turned off when length is 0 and useSymbols flag is on with customSymbol parameter', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: false,
      useNumbers: true,
      useSymbols: true,
      customSymbols: []
    });

    const password = g.generate()[0];

    expect((g as any).useSymbols).toBeFalsy();
    expect(password).toMatch(/^[0-9]+$/);
  });

  test('useSymbols flag should be turned off when length is 0 and useSymbols flag is off with customSymbol parameter', () => {
    const g = new PasswordGenerator({
      useUppercase: false,
      useLowercase: false,
      useNumbers: true,
      useSymbols: false,
      customSymbols: []
    });

    const password = g.generate()[0];

    expect((g as any).useSymbols).toBeFalsy();
    expect(password).toMatch(/^[0-9]+$/);
  });
});

describe('password generation with multiple character combinations', () => {
  const regexTestCases: Array<[
    string,
    RegExp,
    {
      length?: number
      useUppercase?: boolean
      useLowercase?: boolean
      useNumbers?: boolean
      useSymbols?: boolean
      customSymbols?: string[]
    }
  ]> = [
    [
        'combination of A-Z and 0-9 characters',
        /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/,
        {
          useUppercase: true,
          useLowercase: false,
          useNumbers: true,
          useSymbols: false,
        },
      ],
      [
        'combination of A-Z and a-z characters',
        /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z]+$/,
        {
          useUppercase: true,
          useLowercase: true,
          useNumbers: false,
          useSymbols: false,
        },
      ],
      [
        'combination of A-Z and a-z and 0-9 characters',
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]+$/,
        {
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
        },
      ]
    ];

  test.each(regexTestCases)('%s', (_title, regexp, input) => {
    const g = new PasswordGenerator(input);

    const password = g.generate()[0];

    expect(password).toMatch(regexp);
  });
});

describe('multiple password generation test', () => {
  const regexTestCases: Array<[
    number,
    string,
    RegExp,
    {
      length?: number
      useUppercase?: boolean
      useLowercase?: boolean
      useNumbers?: boolean
      useSymbols?: boolean
      customSymbols?: string[]
    }
  ]> = [
    [
      5,
      'combination of A-Z and 0-9 characters',
        /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/,
        {
          useUppercase: true,
          useLowercase: false,
          useNumbers: true,
          useSymbols: false,
        },
      ],
      [
        5,
        'combination of A-Z and a-z characters',
        /^(?=.*[A-Z])(?=.*[a-z])[A-Za-z]+$/,
        {
          useUppercase: true,
          useLowercase: true,
          useNumbers: false,
          useSymbols: false,
        }
      ],
      [
        6,
        'combination of A-Z and a-z and 0-9 characters',
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]+$/,
        {
          useUppercase: true,
          useLowercase: true,
          useNumbers: true,
          useSymbols: false,
        },
      ]
    ];

  test.each(regexTestCases)('%v times: %s', (count, _title, regexp, input) => {
    const g = new PasswordGenerator(input);

    const passwords = g.generate(count);

    expect(passwords.length).toBe(count);
    passwords.forEach((password) => {
      expect(password).toMatch(regexp);
    });
  });
});
