
#!/bin/bash

echo "Checking frontend file structure..."

echo ""

# Check required files

files=(

  "src/pages/Auth/Register.js"

  "src/pages/Auth/Login.js"

  "src/pages/Auth/Auth.css"

  "src/contexts/AuthContext.js"

  "src/contexts/FinanceContext.js"

  "src/components/BudgetEditModal/BudgetEditModal.js"

  "src/utils/date.js"

  "src/utils/format.js"

)

missing=0

for file in "${files[@]}"; do

  if [ -f "$file" ]; then

    echo "✅ Found: $file"

  else

    echo "❌ MISSING: $file"

    missing=$((missing + 1))

  fi

done

echo ""

echo "Total missing files: $missing"

if [ $missing -eq 0 ]; then

  echo ""

  echo "✅ All required files exist!"

else

  echo ""

  echo "❌ Some files are missing. Create them before running npm start."

fi

