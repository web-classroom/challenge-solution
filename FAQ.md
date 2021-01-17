# Questions fréquentes

### Qu'est-ce que EJS ?

[EJS](https://ejs.co/) est un moteur de template très simple qui peut être utilisé avec [Express.js](https://expressjs.com/fr/) pour générer des pages HTML.

Par exemple, ici on va rendre le template `views/example.ejs` en passant une variable `user`

```js
app.get("/", (req, res) => {
  res.render("example", { user: { name: "paulnta" } });
});
```

Puis dans le fichier de template on peut utiliser la syntaxe :
- `<% %>` pour contrôler le flux (conditions, boucles, etc.)
- `<%= %>` pour inclure le contenu d'une variable dans la page 

Exemple :
```html
<!-- views/example.ejs -->
<% if (user) { %>
<h2>Hello <%= user.name %></h2>
<% } %>
```


### J'ai une erreur lorsque j'essaye d'importer un module

Lorsque le flag `--experimental-modules` est utilisé, ce qui est le cas dans ce projet, l'extension est obligatoire dans les imports.

```js
// Don't
import validation from './utils/validation'

// DO
import validation from './utils/validation.js'
```
