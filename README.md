### Management Commands

1. Always use the `-l brian.feister@gmail.com` flag for `rhc` commands to be scoped to the proper org / account
1. SSH into the app via `ssh 559b11c3500446f9e900005c@openlegend-openlegend.rhcloud.com`
1. From ssh'd inside the app, get a status of disk usage quota with `quota -s` or a listing of the 50 largest files in ascending order with `du -h * | sort -rh | head -50`


### Install & Run

1. Clone this repo
1. make sure you have `npm` and `jspm` installed globally
1. `npm install && jspm install`

### Run Production Mode Locally

1. Complete initial install above
1. from project root, `gulp compile-all watch` will compile everything and start the watcher
1. in a separate bash shell, start the project node server from client/dist `cd {project root}/client/dist && npm start`


### Deploy

1. Run `gulp compile-production` to copy and compile assets into the `/dist` directory.
1. Navigate to `/dist` (we deploy from there at present)
1. `git add -A`
1. `git commit -a -m 'my descriptive commit message'`
1. Log into GCE console at `https://console.cloud.google.com/cloudshell/editor?project=ordinal-quarter-116902`
1. `cd src/ordinal-quarter-116902/open-legend-ui/`
1. `git pull origin master`
1. `gcloud app deploy ./app.yaml`
