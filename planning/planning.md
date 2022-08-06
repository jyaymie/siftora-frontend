**Environment Variables**
In your package.json script's section, there are multiple commands with `react-script`. When running the local server, we run `npm start` which is an alias for `react-scripts start`. This is used for a development environment which we want to signal with the `REACT_APP_ENV=dev` environment variable. This will help differentiate what environment you're in so you know which API url to use at build-time.

User Stories:

- As a user, I want to add a product to more than one bin so that I can have an all-inclusive bin and a bin for when I travel.
- As a user, I want to sort products by field so that I can see what products are expiring soon or what brands I tend to purchase from.
- As a user, I want to add photos so that I can easily reference them when I am deciding on a shade in store.

================================================================================
Tech Stack:

- Front-end: HTML, CSS, React, (Maybe: Tailwind, Sass)
- Back-end: Python, Django REST Framework
- Database: PostgreSQL

================================================================================
React Component Hierarchy:
App

> Home (for users to sign up or log in)
> Bins (dashboard)
> Bin (displays the bin's products)
> Products (displays ALL products)
> Form to add/edit a bin
> Form to add/edit a product

================================================================================

### List of backend models and their properties

Bin

> Name
> Product Amount

Makeup

> Brand
> Name
> Shade
> Purchase Date
> Price
> Open Date
> Expiry date
> Use Count
> Finish Date
> Will Repurchase
> Image
> Notes
