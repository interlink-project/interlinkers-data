sphinx-build -b gettext . build/gettext
sphinx-intl update -p build/gettext -l it -l es -l lv
sphinx-build -b html -D language=es . ./build/html/es
sphinx-build -b html -D language=en . ./build/html/en
sphinx-build -b html -D language=it . ./build/html/it
sphinx-build -b html -D language=lv . ./build/html/lv