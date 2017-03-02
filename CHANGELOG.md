# Dockgrant

Run vagrant commands like docker syntax

## [1.0.6] - 2017-02-28

### Added
- Include path option to remove and stop commands
- Exit codes on remove and stop commands

### Changed
- NFS configuration for sharing folders
    - VirtualBox folders doesn't work with BSD based images (OSX)
    - Rsync only has one-way syncronization

## [1.0.5] - 2017-02-27

### Added
- Delete the current machine if the machine is not corrected correctlly

### Changed
- Rsync configuration for sharing folders

## [1.0.4] - 2017-02-27

### Removed
- NFS configuration for sharing folders

## [1.0.3] - 2016-12-29

- Initial version
