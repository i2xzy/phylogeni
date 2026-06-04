import type { Taxon, OttNodeDetails } from '~/types/ott';
import { MAIN_RANKS } from '~/lib/constants/ranks';

const baseUrl = 'https://api.opentreeoflife.org/v3/';

export const post = async (endpoint: string, body: object) => {
  const result = await fetch(`${baseUrl}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return result.json();
};

type MatchNameResult = {
  results?: {
    matches: {
      score: number;
      taxon: Taxon;
    }[];
  }[];
};

export const matchName = async (name: string) => {
  const result: MatchNameResult = await post('tnrs/match_names', {
    names: [name],
    do_approximate_matching: true,
  });

  const matches = result.results?.[0]?.matches || [];

  // console.log(matches);

  return matches
    .filter((item) => item.taxon.ott_id !== 805080)
    .map((item) => ({
      id: item.taxon.ott_id,
      name: item.taxon.name,
      rank: item.taxon.rank,
      extant: !item.taxon.flags?.includes('extinct'),
    }));
};

const ncbiLinkBase =
  'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=';

type Node = {
  node_id: string;
  extinct?: boolean;
  taxon?: Taxon;
  lineage?: Node[];
  children?: Node[];
  descendant_name_list?: string[];
};

type SubtreeResult = {
  arguson: Node;
};

type TaxonInfoResult = {
  flags?: string[];
  synonyms?: string[];
};

const getName = (node: Node) => {
  if (node.descendant_name_list) {
    return `[${node.descendant_name_list.join(' + ')}]`;
  }
  return node.taxon?.name || 'Unnamed Clade';
};

export const getNodeDetails = async (
  ott_id?: string
): Promise<OttNodeDetails | null> => {
  if (!ott_id) return null;

  const { arguson: openTreeResult }: SubtreeResult = await post(
    'tree_of_life/subtree',
    {
      node_id: ott_id,
      format: 'arguson',
      height_limit: 1,
    }
  );

  // console.log(openTreeResult);

  if (!openTreeResult) return null;

  const sources = openTreeResult.taxon?.tax_sources.map((s) => {
    const [name, id] = s.split(':');
    const link = name === 'ncbi' ? `${ncbiLinkBase}${id}` : null;
    return { name, id, link };
  });

  let flags: string[] = [];
  let synonyms: string[] = [];

  if (openTreeResult.taxon) {
    const result: TaxonInfoResult = await post('taxonomy/taxon_info', {
      ott_id: openTreeResult.taxon.ott_id,
    });
    flags = result.flags || [];
    synonyms = result.synonyms?.filter((s) => s.match(/^[a-zA-Z ]+$/)) || [];
  }

  return {
    id: openTreeResult.node_id,
    name: getName(openTreeResult),
    extinct: openTreeResult.extinct || flags.includes('extinct'),
    ...openTreeResult.taxon,
    unique_name:
      openTreeResult.taxon?.unique_name !== openTreeResult.taxon?.name
        ? openTreeResult.taxon?.unique_name
        : undefined,
    lineage: openTreeResult.lineage
      ?.filter(
        (item) =>
          item.node_id === openTreeResult.lineage?.[0]?.node_id ||
          (item.taxon && MAIN_RANKS.includes(item.taxon.rank))
      )
      .map((item) => ({
        id: item.node_id,
        name: getName(item),
        rank: item.taxon?.rank,
        extinct: item.extinct,
      }))
      .reverse(),
    children: openTreeResult.children?.map((item) => ({
      id: item.node_id,
      name: getName(item),
      extinct: item.extinct,
      rank: item.taxon?.rank,
    })),
    // parent: {
    //   id: openTreeResult.lineage?.[0]?.node_id || '',
    //   name: openTreeResult.lineage?.[0]?.taxon?.name || 'unnamed clade',
    // },
    sources,
    synonyms,
  };
};
