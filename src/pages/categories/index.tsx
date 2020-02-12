import { graphql, Link } from "gatsby";
import * as React from "react";


import SiteNav from '../../components/header/SiteNav';
import Wrapper from "../../components/Wrapper";
import IndexLayout from "../../layouts";
import { inner, outer, SiteDescription, SiteHeader, SiteHeaderContent, SiteMain, SiteTitle } from "../../styles/shared";
import { PageContext } from "../../templates/post";
import Footer from "../../components/Footer";
import {TagFeed, TagBlock, TagDiv} from './style';

import _ from "lodash";

/**
 * TODO: Make interface(type) first
 * TODO: Write query for graphQL
 * TODO: get last Category from post frontmatter
 * TODO: Prettify data using lodash.
 */

interface CategoryPageProps {
  data: {
    categoriesData: {
      edges: Array<{
        node: PageContext;
      }>;
    };
  };
}

const CategoryPage: React.FC<CategoryPageProps> = props => {
  const categories: string[] = _.uniq(
    _.flatten(
      props.data.categoriesData.edges.map(edge => {
        return _.castArray(_.get(edge, 'node.frontmatter.category', []));
      }),
    ),
  );
  categories.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  });
  var tagInfo = new Object();
  categories.forEach(function(category) {
    var count = 0;
    // Find posts whose tag include argument.
    props.data.categoriesData.edges.forEach(function(edge) {
      const arr = _.castArray(_.get(edge, 'node.frontmatter.category', []));
      if (arr.indexOf(category) != -1) {
        count++;
      }
    });
    (tagInfo as any)[category] = count;
  });

  return (
    <IndexLayout>
      <Wrapper>
        <header css={[SiteHeader, outer]}>
          <div css={inner}>
            <SiteNav isHome={false} />
            <SiteHeaderContent>
              <SiteTitle>All Categories</SiteTitle>
              <SiteDescription>
                  We have {categories.length} categories here!
              </SiteDescription>
            </SiteHeaderContent>
          </div>
        </header>
        <main id="site-main" css={[SiteMain, outer]}>
          <div css={inner}>
            <TagDiv>
              <div css={TagFeed}>
                {categories.map((category, index) => (
                  <Link css={TagBlock} to={`/categories/${_.kebabCase(category)}/`} key={index}>
                    # {category}({(tagInfo as any)[category]})
                  </Link>
                ))}
              </div>
            </TagDiv>

          </div>
        </main>
        <Footer />
      </Wrapper>
    </IndexLayout>
  );
};

export default CategoryPage;

export const pageQuery = graphql`
  query {
    categoriesData: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            category
          }
        }
      }
    }
  }
`;
