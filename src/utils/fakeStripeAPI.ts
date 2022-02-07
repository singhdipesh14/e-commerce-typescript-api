const fakeStripeAPI = async ({
	amount,
	currency,
}: {
	amount: number
	currency: string
}) => {
	const clientSecret = "someRandomValue"
	return { clientSecret, amount }
}
export default fakeStripeAPI
