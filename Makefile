.PHONY: build bump validate audit content-audit conversion-audit registry-guard release full clean-releases

build:
	python3 tools/build.py

bump:
	python3 tools/build.py --bump

validate:
	python3 tools/validate.py

audit:
	python3 tools/site_audit.py

content-audit:
	python3 tools/content_audit.py

registry-guard:
	python3 tools/registry_guard.py

release:
	python3 tools/release.py

full:
	python3 tools/build.py --bump
	python3 tools/validate.py
	python3 tools/registry_guard.py
	python3 tools/site_audit.py
	python3 tools/content_audit.py
	python3 tools/conversion_audit.py
	python3 tools/release.py

clean-releases:
	rm -f releases/*.zip

conversion-audit:
	python3 tools/conversion_audit.py
