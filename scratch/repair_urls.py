import os

def repair_urls():
    src_path = r"c:\Users\agrep\OneDrive\Desktop\Emplay Inc. Assignment\frontend\src"
    for root, dirs, files in os.walk(src_path):
        for file in files:
            if file.endswith(".tsx"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # The messed up pattern looked like this: `${...}/api/prompts/'
                # We need to change the ' to `
                new_content = content.replace("/api/prompts/',", "/api/prompts/',") # placeholder check
                
                # Systematic fix: Find mismatched template literals
                # Actually, let's just replace the specific broken pattern
                new_content = content.replace("}/api/prompts/',", "}/api/prompts/`,")
                new_content = new_content.replace("}/api/prompts/')", "}/api/prompts/`)")
                
                # Check for PromptDetail specifically
                new_content = new_content.replace("}/api/prompts/${id}/')", "}/api/prompts/${id}/`) ")
                
                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Repaired: {file}")

if __name__ == "__main__":
    repair_urls()
