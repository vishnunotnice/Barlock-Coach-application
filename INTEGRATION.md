# Coach application integration

This is a demo UI. It does not transmit applications, create accounts, upload documents, or issue application IDs. The review action explicitly says so. Draft text is saved in this browser's local storage; selected files are kept only in memory and must be selected again after a reload. Avoid using shared devices for real personal data.

The intended page route is `/coach/apply`. Deploy it under `https://www.barlock.fitness` only when the host's routing is configured for this application. Do not link the gateway to it until that route is reachable.

Before accepting applications, implement `POST /api/v1/coaches/applications` on a trusted backend. Validate all fields, age, file types/sizes, client-consent confirmation, and acknowledgements server-side; apply abuse protection, idempotency, and authorization for staff review. Store applications separately from coach accounts, with status `submitted`, and never auto-approve. Store documents in private object storage with access-controlled retrieval, malware scanning, retention and deletion policies. Return a server-generated application reference; show the requested success screen only after a confirmed response. Supported lifecycle statuses: draft, submitted, under review, approved, rejected, and more information required.

Supply verified links to the actual Terms of Service, Privacy Policy and professional guidelines before real submissions. Review legal bases, retention, and handling of identity and qualification documents before launch. Add a secure file upload mechanism (for example, short-lived upload authorizations) and retry-safe submit state; never expose privileged credentials to the browser.
