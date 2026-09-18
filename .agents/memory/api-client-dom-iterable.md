---
name: Generated API client DOM iterable types
description: The generated fetch helper uses Headers.entries(), which requires the DOM iterable library in the shared API client TypeScript config.
---

Keep `dom.iterable` enabled wherever generated browser API clients are typechecked.

**Why:** Orval's generated fetch helper iterates over `Headers`; the default DOM library alone can fail the workspace typecheck even when code generation succeeds.

**How to apply:** If codegen succeeds but `Headers.entries` is missing from TypeScript, check the API client's `lib` list before changing generated output.