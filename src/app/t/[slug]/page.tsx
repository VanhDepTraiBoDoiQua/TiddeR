import {FC} from 'react';

interface CommunityPageProps {
    params: {
        slug: string;
    }
}

const CommunityPage: FC<CommunityPageProps> = ({params}: CommunityPageProps) => {

    const {slug} = params;

    return (
        <div>community</div>
    );
};

export default CommunityPage;