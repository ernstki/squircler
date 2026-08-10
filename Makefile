APPNAME = Squircler
HOMEPAGE = https://github.com/ernstki/squircler

help:  # prints this help
	@bash -c "$$AUTOGEN_HELP_BASH" < $(firstword $(MAKEFILE_LIST))

dev:  # runs the app in (autoreload) development mode
	npm run tauri dev

build:  # builds the release version of the app (.deb, etc.)
	npm run tauri build

release:  # tags a new release [NEWVERSION=x.y.z, BUMP={major,minor,patch}]
ifneq ($(and $(NEWVERSION),$(BUMP)),)
	$(error Cannot specify NEWVERSION and BUMP at the same time)
endif
ifeq ($(WORKTREEDIRTY)!$(DRYRUN),1!)
	$(error Git work tree dirty. Please commit changes and try again)
endif
ifneq ($(and $(NEWVERSION),$(BUMP)),)
	$(error Cannot specify NEWVERSION and BUMP at the same time)
endif
ifdef BUMP
	@# FYI: `npm version` treats x.y.z and `patch` equally, so maybe I can
	@# simplify this someday…
	@newver=$$( $(call BUMPVER,$(VERSION),$(BUMP)) ) && \
	npm version $$newver --no-git-tag-version && \
	$(call UPDATEJSONVERSION,$$newver,src-tauri/tauri.conf.json) && \
	$(call UPDATETOMLVERSION,$$newver,src-tauri/Cargo.toml) && \
	$(call MAYBEDRYRUN,git add .) && \
	$(call MAYBEDRYRUN,git commit -em "Release v$$newver") && \
	$(call MAYBEDRYRUN,git tag v$$newver)
else
ifdef NEWVERSION
	@# FIXME: duplicate code
	@npm version $(NEWVERSION) --no-git-tag-version
	@$(call UPDATEJSONVERSION,$$newver,src-tauri/tauri.conf.json) && \
	$(call UPDATETOMLVERSION,$$newver,src-tauri/Cargo.toml) && \
	$(call MAYBEDRYRUN,git add .) && \
	$(call MAYBEDRYRUN,git commit -em "Release v$$newver") && \
	$(call MAYBEDRYRUN,git tag v$(NEWVERSION))
else
	$(error Must specify either NEWVERSION=x.y.z or BUMP={major|minor|patch})
endif
endif
	@printf  "\nNow would be a good time to "; \
	printf "`tput bold`git push && git push --tags`tput sgr0`!\n\n"

clean:  # cleans generated files
	$(info This target is unimplemented, for now.)


##
##  internals you can safely ignore
##

VERSION = $(shell sed -nE 's/.*"version":[[:space:]]+"(.*)".*/\1/p' package.json)
# this works fine , but relies on having `node` available right out of the gate
#$(shell node -p 'require("./package.json").version')
MAYBEDRYRUN = $(if $(DRYRUN),echo DRY RUN: )$(1)
WORKTREEDIRTY = $(shell if git status --porcelain | grep -q .; then echo 1; fi)
# 'sed -i' isn't standard and doesn't work consistenly for Mac/BSD and Linux,
# so I'm not using it here, but uuuuuuuuuugggggh… try `npm version` later
define UPDATEJSONVERSION
sed -E 's/(^[[:space:]]*"version":[[:space:]]*)".*"/\1"'$(1)'"/' $(2) > $(2).new && \
	mv $(2).new $(2)
endef
define UPDATETOMLVERSION
sed -E 's/(^[[:space:]]*version[[:space:]]*=[[:space:]]*)".*"/\1"'$(1)'"/' $(2) > $(2).new && \
	mv $(2).new $(2)
endef

##
##  Bump a version number in x.y.z format; defaults to incrementing the
##  patchlevel (the ‘z’ part in the example) by one.
##
##  Author:    Kevin Ernst <kevin.ernst@cchmc.org>
##  Date:      11 February 2020
##  License:   MIT
##
define BUMPVER
awk -F. ' \
	BEGIN { \
		split(ARGV[1], parts); \
\
		if (length(parts) != 3) { \
			print > "/dev/stderr"; \
			print "ERROR: expected a SemVer-like version string, e.g., ‘x.y.z’" \
				> "/dev/stderr"; \
			print > "/dev/stderr"; \
			exit 1; \
		} \
\
		which = ARGV[2]; \
		if (which == "") which = "patch"; \
\
		if (which ~ /^maj/) { \
			parts[1] += 1; \
			parts[2] = 0; \
			parts[3] = 0; \
		} else if (which ~ /^min/) { \
			parts[2] += 1; \
			parts[3] = 0; \
		} else if (which ~ /^patch/) { \
			parts[3] += 1; \
		} else { \
			print "ERROR: expected one of ‘major’, ‘minor’, or ‘patch’" \
				> "/dev/stderr"; \
			exit 1; \
		} \
\
		printf "%d.%d.%d\n", parts[1], parts[2], parts[3]; \
	}' "$(1)" "$(2)"
endef

define AUTOGEN_HELP_BASH
	declare -A targets; declare -a torder
	targetre='^([A-Za-z]+):.* *# *(.*)'
	if [[ $$TERM && $$TERM != dumb && -t 1 ]]; then
		ul=$$'\e[0;4m'; bbold=$$'\e[34;1m'; reset=$$'\e[0m'
	fi
	printf "\n  %sProject tasks for $(APPNAME) v$(VERSION)" "$$ul"
	printf "%s\n\n" "$$reset"
	while read -r line; do
		if [[ $$line =~ $$targetre ]]; then
			target=$${BASH_REMATCH[1]}; help=$${BASH_REMATCH[2]}
			torder+=("$$target")
			targets[$$target]=$$help
			if (( $${#target} > max )); then max=$${#target}; fi
		fi
	done
	for t in "$${torder[@]}"; do
		printf "    %smake %-*s%s   %s\n" "$$bbold" $$max "$$t" "$$reset" \
		       "$${targets[$$t]}"
	done
	if [[ -n "$(HOMEPAGE)" ]]; then
		printf "\n  Homepage:\n    $(HOMEPAGE)\n\n"
	else
		printf "\n"
	fi
endef
export AUTOGEN_HELP_BASH
