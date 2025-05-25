// js/javascriptAnalyzer.js
// JavaScript analyzer using ESLint

window.jsAnalyzer = (() => {
  function analyzeJavaScript(code) {
    const linter = new eslint.Linter();

    const config = {
      env: { browser: true, es6: true, node: true },
      parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
      rules: {
        semi: ['warn', 'always'],
        'no-unused-vars': ['warn'],
        'no-undef': 'error',
        'no-debugger': 'warn',
        'no-console': 'off',
        eqeqeq: 'warn',
        curly: 'warn',
        'no-extra-bind': 'warn',
        'no-func-assign': 'error',
        'no-implied-eval': 'warn',
        'no-empty-function': 'warn',
        complexity: ['warn', { max: 8 }],
      },
    };

    const messages = linter.verify(code, config);

    if (messages.length === 0) {
      return {
        errors: [],
        suggestions: ['No errors detected. Code looks good!'],
        fixedCode: code,
      };
    }

    const errors = [];
    const suggestions = [];

    messages.forEach((msg) => {
      const level = msg.severity === 2 ? 'Error' : 'Warning';
      const rule = msg.ruleId ? ` [${msg.ruleId}]` : '';
      errors.push(`${level} (Line ${msg.line}, Col ${msg.column}): ${msg.message}${rule}`);

      switch (msg.ruleId) {
        case 'semi':
          suggestions.push('Add missing semicolons to terminate statements properly.');
          break;
        case 'no-unused-vars':
          suggestions.push('Remove or use unused variables to clean code.');
          break;
        case 'no-undef':
          suggestions.push('Define or import missing variables or functions.');
          break;
        case 'no-debugger':
          suggestions.push("Remove 'debugger' statements for production.");
          break;
        case 'eqeqeq':
          suggestions.push('Use strict equality (===) instead of == for better type safety.');
          break;
        case 'curly':
          suggestions.push('Always use curly braces for blocks to avoid mistakes.');
          break;
        default:
          suggestions.push(`Check rule: ${msg.ruleId} for details.`);
          break;
      }
    });

    // Auto-fix code where possible
    let fixedCode = code;
    try {
      const fixResult = linter.verifyAndFix(code, config);
      fixedCode = fixResult.output || code;
    } catch {
      // fallback: no fix
    }

    if (/for\s*\(var\s+i\s*=\s*0/.test(code)) {
      suggestions.push("Consider using 'let' instead of 'var' for block scoping in loops.");
    }
    if (/==/.test(code)) {
      suggestions.push("Use '===' instead of '==' to avoid unexpected type coercions.");
    }

    return { errors, suggestions, fixedCode };
  }

  return { analyzeJavaScript };
})();
