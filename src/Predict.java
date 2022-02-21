import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * 
 */

/**
 * @author Raja M
 *
 */
public class Predict {

	private static List<Integer> sequences = Arrays.asList(
			27,14,17,31,29,24,12,5,18,31,36,36,7,19,4,0,26,14,36,7,8,16,6,
			29,00,30,27,4,0,19,21,19,00,13,26,1,19,30,7,17,5,14,19,18,34,27,
			00,33,29,27,7,24,18,20,27,25,15,31,6,1,13,5,3,22,00,32,29,1,32,
			1,30,35,4,15,30,1,22,27,28,12,0,33,25,18,11,36,4,25,31,0,26,15,
			17,16,7,18,3,34,1,36,13,9,29,9,7,26,25,16,23,22,15,16,0,6,19,
			00,13,1,20,1,23,0,2,23,36,00,00,29,11,29,3,16,18,20,8,21,24,17,
			35,1,11,29,15,26,32,15,12,29,34,00,27,29,3,33,31,5,12,30,30,20,00,
			10,22,31,17,36,3,14,34,5,6,22,23,23,29,26,7,21,11,14,30,23,35,12,
			14,30,23,35,12,12,28,15,5,13,28,20,00,28,19,29,24,32,14,26,17,16,9,0,
			7,13,10,25,27,19,35,1,25,18,0,19,12,8,6,17,8,20,8,30,4,12,23,10,20
			);

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int find = 0;

		for (int i = 0; i <= 36; i++) {
			List<Integer> analysisData = getAnalysisData(i);
			LinkedHashMap<Object, Long> result = groupAndSort(analysisData);
			System.out.println(i + ":: " + result);
		}
		//LinkedHashMap<Object, Long> sortedAfter = groupNumbers(after);
		//System.out.println("Analysis After List:"+ sortedAfter);
		
	}

	private static List<Integer> getAnalysisData(int find) {
		List<Integer> before = new ArrayList<Integer>();
		List<Integer> after = new ArrayList<Integer>();
		List<Integer> indexes = getIndexes(find);
		for (Integer index : indexes) {
			if (index + 1 < sequences.size()) {
				before.add(sequences.get(index + 1));
			}
			if (index - 1 >= 0) {
				before.add(sequences.get(index - 1));
				//after.add(sequences.get(index - 1));
			}
		}
		return before;
	}

	private static LinkedHashMap<Object, Long> groupAndSort(List<Integer> list) {
		Map<Object, Long> grouped = new TreeMap<Object, Long>(list.stream().collect(Collectors.groupingBy(e -> e, Collectors.counting())));
		LinkedHashMap<Object, Long> sorted = grouped.entrySet().stream()
				  .sorted(Map.Entry.comparingByValue(Comparator.reverseOrder()))
				  .collect(Collectors.toMap(Map.Entry::getKey,Map.Entry::getValue,(e1, e2) -> e1, LinkedHashMap::new));
		return sorted;
	}

	private static List<Integer> getIndexes(Integer num) {
		List<Integer> indexes = new ArrayList<Integer>();
		for (int i=0; i<sequences.size();i++) {
			if(sequences.get(i)==num) {
				indexes.add(i);
			}
		}
		return indexes;
	}
}
