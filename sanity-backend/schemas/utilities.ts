const portfolioPagesRestrition = pages => {
    if (pages.length !== 6) {
        return 'You must have 6 pages';
    }
    const pageNames = pages.map(page => page._type);
    const uniquePageNames = [...new Set(pageNames)];
    if (uniquePageNames.length !== 6) {
        return 'Each page must be unique';
    }
    return true;
}

export { portfolioPagesRestrition };