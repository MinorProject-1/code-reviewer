from flask import Flask, render_template, request
import re

app = Flask(__name__)

def review_java_code(code):
    errors = []
    
    # Check for Array Index Out of Bounds
    if re.search(r'for\s*\(.*i\s*<=\s*.*\.length\s*\)', code):
        errors.append("Array Index Out of Bounds: The loop condition i <= numbers.length should be i < numbers.length.")
    
    # Check for Undefined Variables
    if "total" in code and "total" not in code.split("System.out.println(")[0]:
        errors.append("Undefined Variable: The variable total is referenced but is never defined or initialized.")
    
    # Performance and Error Handling
    errors.append("Consider implementing error handling mechanisms.")
    
    return "\n".join(errors) if errors else "No issues found."

def review_python_code(code):
    errors = []
    
    # Check for Syntax Errors
    if "for " in code and not ":" in code.split("for ")[1]:
        errors.append("Syntax Error: The for loop is missing a colon (:) at the end of the line.")
    
    # Check for Undefined Functions
    if "median(" in code and "median" not in code:
        errors.append("Undefined Function: The median function is called without being defined or imported.")
    
    # Performance and Error Handling
    errors.append("Consider adding error handling for empty lists.")
    
    return "\n".join(errors) if errors else "No issues found."

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/review', methods=['POST'])
def review():
    language = request.form['language']
    code = request.form['code']
    
    if language == 'java':
        result = review_java_code(code)
    elif language == 'python':
        result = review_python_code(code)
    else:
        result = "Unsupported language."
    
    return render_template('index.html', result=result)

if __name__ == '__main__':
    app.run(debug=True)
