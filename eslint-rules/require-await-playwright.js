export default {
    meta: {
        type: "problem",
        docs: {
            description: "Require `await` before Playwright method calls",
        },
        schema: [], // no options
    },
    create(context) {
        const playwrightObjects = [
            "page",
            "locator",
            "frame",
            "request",
            "response",
            "expect"
        ];

        // Whitelist methods that are OK without await
        const WHITELISTED_METHODS = [
            "waitForLoadState",
            "networkidle",
            "goto",
            "route",
            "close",
            "screenshot",
            "waitForSelector",
            "waitForResponse",
            "waitForRequest",
            "locator" // <-- ignore locator creation
        ];

        const PAGE_LOCATOR_METHODS = ["locator", "getByRole", "getByTitle", "getByText", "getByLabel", "getByPlaceholder"];

        return {
            CallExpression(node) {
                // Ignore if already awaited
                if (node.parent && node.parent.type === "AwaitExpression") return;

                if (
                    node.callee.type === "MemberExpression" &&
                    node.callee.object &&
                    node.callee.object.type === "Identifier" &&
                    playwrightObjects.includes(node.callee.object.name)
                ) {
                    const methodName = node.callee.property.name;

                    // Ignore whitelisted methods
                    if (WHITELISTED_METHODS.includes(methodName)) return;

                    // Special case: `expect(something)` is OK without await
                    if (node.callee.object.name === "expect") return;

                    // Skip Page methods that create Locators
                    if (
                        node.callee.object.type === "Identifier" &&
                        node.callee.object.name === "page" &&
                        node.callee.property.type === "Identifier" &&
                        PAGE_LOCATOR_METHODS.includes(node.callee.property.name)
                    ) {
                        return;
                    }

                    context.report({
                        node,
                        message: "Missing `await` before Playwright method call '{{method}}'.",
                        data: { method: methodName },
                    });
                }
            }
        };
    }
};
