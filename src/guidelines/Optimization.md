## Optmization rules

### Storage Rules (Firebase Storage)

```
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() { return request.auth != null; }

    // Capas de viagem geradas pelo app
    match /trip-covers/{allPaths=**} {
      allow read: if true;          // público (ajuste se quiser)
      allow write: if isSignedIn(); // somente usuários logados
    }
  }
}
```
