# Vite Vanilla JS Template

Initially built for personal use, I created this template for starting a new project with Vite.js and Vanilla Javascript.
It is already set up with standard development tools like Prettier for easy code formatting and linting.

## Scripts

Use the following scripts for your development workflow:

```bash
# Start the development server
npm run dev

# Formats your code in a consistent, predefined style using Prettier
npm run format

# Build for production
npm run build
```

## Folder Structure

This is the structure of the project:

```plaintext
/
├── node_modules            # Node.js dependencies for the project.
├── src                     # Source code
│   ├── blocks              # Blocks html markup
│   ├── fonts               # Store your fonts here
│   ├── images              # Store your images here
│   ├── js                  # Javascript files of your project
│   ├── scss                # CSS styles for your project
│   ├── sprites             # SVG files for generate sprites
├── .editorconfig           # Configuration for the EditorConfig plugin
├── .gitignore              # Files and folders to be ignored by Git
├── .prettierignore         # Files to be ignored by Prettier
├── .prettierrc             # Configuration for Prettier
├── index.html              # The HTML file for your project
├── LICENSE                 # The license for your project
├── package.json            # Defines your project and its dependencies
├── postcss.config.cjs      # Configuration for PostCSS
├── README.md               # This file
├── vite.config.js          # Configuration for Vite (for build regular & minified JS & CSS files)
```

## SVG usage

SVG спрайты собираются на основе содержимого папки `src/sprites`. При этом, они группируются по
названиям вложенных папок. Например, если в `src/sprites` есть подпапка `icons`, то для неё будет
сгенерирован отдельный файл `sprites/icons.svg`, содержащий все SVG-файлы из этой папки.

Таким образом, каждый каталог внутри `src/sprites` создаёт свой собственный SVG-спрайт с элементами из этой папки.

Вот как использовать в вёрстке:

```
<svg width="16" height="16" viewBox="0 0 16 16" role="presentation">
  <use xlink:href="./assets/sprites/icons.svg#linkedin-logo"></use>
</svg>
```

## License

This template was created under the [MIT License](LICENSE.md).

**Happy coding!** 👨‍💻
