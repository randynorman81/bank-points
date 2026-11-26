import ast, re
def print_words(s):
    """Plain-English description of a print(...) line with any mix of text, names and expressions, or None."""
    try: t = ast.parse(s.strip())
    except SyntaxError: return None
    if len(t.body) != 1 or not isinstance(t.body[0], ast.Expr) or not isinstance(t.body[0].value, ast.Call): return None
    c = t.body[0].value
    if not (isinstance(c.func, ast.Name) and c.func.id == 'print') or c.keywords or not c.args: return None
    parts = []
    for a in c.args:
        src = ast.unparse(a)
        if isinstance(a, ast.Constant) and isinstance(a.value, str): parts.append('the text "%s"' % a.value)
        elif isinstance(a, ast.Name): parts.append('the value stored in `%s`' % a.id)
        else: parts.append('the value of `%s`' % src)
    if len(parts) == 1:
        a = c.args[0]
        if isinstance(a, ast.Name) or (isinstance(a, ast.Constant) and isinstance(a.value, str)): return 'Print ' + parts[0] + '.'
        return 'Print `%s`.' % ast.unparse(a)
    return 'Print ' + ', then '.join(parts) + ' (print puts a space between them).'
