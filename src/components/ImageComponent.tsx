const ImageComponent = ({ node, uid, url, image }: { node: any, uid: number, url: string, image: { width: number } }) => {

    if (!node.image || !node.image.name) {
        return null;
    }
    return (
        <div style={{ width: "100%", borderRadius: 5 }}>
            <img
            src={`${url}/api/blog/${uid}/${image.width}/${node.image.name}`}
            alt=""
            width="100%"
            />
        </div>
    )
}

export {
    ImageComponent
}