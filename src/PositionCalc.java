import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

/**
 * 
 */

/**
 * @author Raja
 *
 */
public class PositionCalc {

	private static List<Integer> numbers = Arrays.asList(0,2,14,35,23,4,16,33,21,6,18,31,19,8,12,29,25,10,27,88,1,13,36,24,3,15,34,22,5,17,32,20,7,11,30,26,9,28);
	private static List<Integer> printNumbers = Arrays.asList(0,88,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36);
	/**
	 * @param args
	 */
	public static void main(String[] args) {

		int total = 38;
		for (Integer num : printNumbers) {
			int startNum = num;
			for (int moves = 1; moves < 19; moves++) {
				List<Integer> formation = new ArrayList<Integer>();
				formation = formRollingSequence(formation, startNum);
				// System.out.println("Formation: " + formation);
				List<Integer> positions = locateSlots(formation, total, moves);
				//System.out.println("Start:" + num + "::> Move::> " + moves + ":: Bet @ " + positions.stream().sorted().collect(Collectors.toList()));
				System.out.println("" + num + "||" + moves + "# " + positions.stream().sorted().collect(Collectors.toList()));
			}
		}
	}

	/**
	 * @param formation
	 * @param total
	 * @param moves
	 * @return
	 */
	private static List<Integer> locateSlots(List<Integer> formation, int total, int moves) {
		List<Integer> positions = new ArrayList<Integer>();
		//positions.add(formation.get(0));
		for(int i=1;i<=total;i++) {
			//if(i==moves || i==19 || i==(19-moves) || i==(19+moves) || i== (total-moves)) {
				if(i==moves || i==(19-moves) || i==(19+moves) || i== (total-moves)) {
				if(i<total) {
					positions.add(formation.get(i));
				}
			} 
		}
		return positions;
	}

	/**
	 * @param formation
	 * @param startNum
	 */
	private static List<Integer> formRollingSequence(List<Integer> formation, int startNum) {
		int startIndex = numbers.indexOf(startNum);
		if(startIndex !=-1) {
			int k=startIndex;
			for(;k<38;k++) {
				formation.add(numbers.get(k));
			}
			if(formation.size()!=38) {
				for(int l=0;l<startIndex;l++) {
					formation.add(numbers.get(l));		
				}
			}
		}
		return formation;
	}

}
