import os

def fix_api_calls():
    src_path = r"c:\Users\agrep\OneDrive\Desktop\Emplay Inc. Assignment\frontend\src"
    for root, dirs, files in os.walk(src_path):
        for file in files:
            if file.endswith(".tsx"):
                filepath = os.path.join(root, file)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Replace standard fetch call with environment variable aware one
                new_content = content.replace("fetch('/api/prompts/", "fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/prompts/")
                
                # Also handle template strings like `/api/prompts/${id}/`
                new_content = new_content.replace("fetch(`/api/prompts/", "fetch(`${import.meta.env.VITE_BACKEND_URL || ''}/api/prompts/")
                
                if new_content != content:
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Updated: {file}")

if __name__ == "__main__":
    fix_api_calls()
