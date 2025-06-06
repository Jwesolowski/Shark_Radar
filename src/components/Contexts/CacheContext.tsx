import PropTypes from "prop-types";
import React from "react";
import CacheInstance from "../../utils/Cache.ts";

const CacheContext = React.createContext({
	cache: {} as typeof CacheInstance,
	setCache: (cache: typeof CacheInstance) => {},
	loaded: false
});

function CacheContextProvider(props: {
	children: React.ReactNode;
}) {
	const { children } = props;

	const [cache, setCache] = React.useState(CacheInstance);
	const [loaded, setLoaded] = React.useState(false);

	const loadCollections = async () => {
		await CacheInstance.loadCollections();
		setCache(CacheInstance);
		setLoaded(true);
	};

	React.useEffect(() => {
		loadCollections();
	}, []);

	return (
		<CacheContext.Provider value={{ cache, setCache, loaded }}>
			{children}
		</CacheContext.Provider>
	);
}

CacheContextProvider.propTypes = {
	children: PropTypes.node.isRequired
};

export {
	CacheContext,
	CacheContextProvider
};
