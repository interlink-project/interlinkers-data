# MOVED DATA TO https://github.com/interlink-project/backend-catalogue/tree/master/catalogue/seed

# WHY?

We need to store this data along with the rest of the application, as the data contained here is directly dependent on which version of the data model migration is using a specific version.

That is, when we want to rollback to older versions of the application, we should have not only the functionality/schema of the data model of that previous version, but also the seed data.
