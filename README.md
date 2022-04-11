# Invoice Line

Génération de facture de prestation de service, en ligne de commande.

## Installation

Pour installer l'application, il faudra cloner le projet et installer les différents packages.

```yarn
yarn install
```

Il faudra ensuite copier/coller la configuration `config.example.json` et la renommer `config.json`.

## Usage

### Configuration

L'application fonctionne avec une configuration minimum qui est le fichier `config.json`.
Cette configuration compose l'ensemble des informations permettant de générer votre facture de prestation.

| ID            | Description                 |
| ------------- | --------------------------- |
| invoice.count | Compte du nombre de facture |
| company       | Le nom de votre société     |
| contact       | Votre nom / prénom          |
| address       | Votre adresse postale       |
| siret         | Votre siret                 |
| iban          | Votre IBAN                  |
| bic           | Votre BIC                   |
| tva           | Votre numéro de TVA         |
| phone         | Votre numéro de téléphone   |
| mail          | Votre mail                  |
| website       | Votre site web              |
| tjm           | Taux journalier moyen en €  |

Comment construire sa base données cliente ?
Dans le fichier de configuration, il est possible d'ajouter des objets dans le tableau `customers` avec différentes informations.

| ID      | Description                |
| ------- | -------------------------- |
| name    | Nom du client              |
| address | Addresse postale du client |
| siret   | Siret du client            |
| tva     | Numéro de TVA du client    |
| website | Site web du client         |

### Commande de lancement

```yarn
yarn run invoice
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
