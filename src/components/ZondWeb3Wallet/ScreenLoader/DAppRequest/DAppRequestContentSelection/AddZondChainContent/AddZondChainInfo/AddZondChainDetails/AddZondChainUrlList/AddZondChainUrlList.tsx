type AddZondChainUrlListProps = {
  title: string;
  urlList: string[];
};

const AddZondChainUrlList = ({ title, urlList }: AddZondChainUrlListProps) => {
  if (!!urlList.length)
    return (
      <div className="flex flex-col gap-1">
        <div>{title}</div>
        {urlList.map((url, index) => (
          <div className="font-bold text-secondary">
            {index + 1}. {url}
          </div>
        ))}
      </div>
    );
};

export default AddZondChainUrlList;
