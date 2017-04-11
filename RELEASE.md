# Release Process

The following is the release process you should follow to publish a new version of `ember-qunit`.

## Update The Changelog

First, we need to update the `CHANGELOG.md` file for the project. We do this via the [GitHub Changelog Generator](https://github.com/skywinder/github-changelog-generator/), using the following command:

```bash
github_changelog_generator --future-release vx.x.x
```

Where you replace the `x.x.x` with the appropriate version you are publishing.

_Note: Ensure you set up a [GitHub Token](https://github.com/skywinder/github-changelog-generator/#github-token) when using the changelog generator, or else it will not work properly._

Review the changes and then commit them with a message like:

```bash
git commit -am "Update CHANGELOG for x.x.x."
```

## Bump The Version

Next, we bump the version of the addon and tag it. You can do this by using the default `npm version` command, like so:

```bash
npm version x.x.x
```

That should bump the version in `package.json`, commit it, and then tag it.

Next, push the version bump and the changelog changes to the repository.

## Publish The Release

Once the changes have been pushed, run:

```bash
npm publish
```

To actually publish the new release.

Finally, update the [GitHub Releases page](https://github.com/emberjs/ember-qunit/releases) with a new release; using the changelog info as the release notes.
