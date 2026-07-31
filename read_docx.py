import zipfile
import xml.etree.ElementTree as ET

def get_docx_text(path):
    WORD_NAMESPACE = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
    PARA = WORD_NAMESPACE + 'p'
    TEXT = WORD_NAMESPACE + 't'
    
    with zipfile.ZipFile(path) as docx:
        tree = ET.fromstring(docx.read('word/document.xml'))
        paragraphs = []
        for paragraph in tree.iter(PARA):
            texts = [node.text for node in paragraph.iter(TEXT) if node.text]
            if texts:
                paragraphs.append(''.join(texts))
        return '\n'.join(paragraphs)

try:
    text = get_docx_text('ТЗ.docx')
    with open('tz.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Successfully wrote tz.txt")
except Exception as e:
    import traceback
    traceback.print_exc()
