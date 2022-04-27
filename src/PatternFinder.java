import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * 
 */

/**
 * @author Raja Mario
 *
 */
public class PatternFinder {

	
	private static List<Integer> numbers = Arrays.asList(0,2,14,35,23,4,16,33,21,6,18,31,19,8,12,29,25,10,27,88,1,13,36,24,3,15,34,22,5,17,32,20,7,11,30,26,9,28);

	private static List<Integer> todayPattern = Arrays.asList(88, 32, 34, 23, 19, 15, 18, 36, 24, 27, 5, 35, 6, 19, 25, 36, 25, 29, 5, 14, 17, 33);
	
	private static List<List<Integer>> db = new ArrayList<List<Integer>>();
	
	static {
		db.add(Arrays.asList(88, 32, 34, 23, 19, 15, 18, 36, 24, 27, 5, 35, 6, 19, 25, 36, 25, 29, 5, 14, 17, 33));
		db.add(Arrays.asList(4, 8, 21, 32, 27, 29, 2, 32, 15, 35, 34, 19, 6, 11, 0, 88, 31, 26, 9, 3, 3, 25, 24));
		db.add(Arrays.asList(9, 31, 15, 34, 17, 88, 15, 20, 1, 22, 27, 16, 1, 22, 6, 20, 14, 6, 2, 4, 7, 13, 17));
		db.add(Arrays.asList(7, 31, 10, 25, 36, 14, 88, 18, 24, 17, 14, 3, 30, 16, 25, 15, 22, 88, 28, 3, 3, 88, 8));
		db.add(Arrays.asList(27, 14, 17, 31, 29, 24, 12, 5, 18, 31, 36, 36, 7, 19, 4, 0, 26, 14, 36, 7, 8, 16, 6));
		db.add(Arrays.asList(29, 88, 30, 27, 4, 0, 19, 21, 19, 88, 13, 26, 1, 19, 30, 7, 17, 5, 14, 19, 18, 34, 27));
		db.add(Arrays.asList(88, 33, 29, 27, 7, 24, 18, 20, 27, 25, 15, 31, 6, 1, 13, 5, 3, 22, 88, 32, 29, 1, 32));
		db.add(Arrays.asList(1, 30, 35, 4, 15, 30, 1, 22, 27, 28, 12, 0, 33, 25, 18, 11, 36, 4, 25, 31, 0, 26, 15));
		db.add(Arrays.asList(17, 16, 7, 18, 3, 34, 1, 36, 13, 9, 29, 9, 7, 26, 25, 16, 23, 22, 15, 16, 0, 6, 19));
		db.add(Arrays.asList(88, 13, 1, 20, 1, 23, 0, 2, 23, 36, 88, 88, 29, 11, 29, 3, 16, 18, 20, 8, 21, 24, 17));
		db.add(Arrays.asList(35, 1, 11, 29, 15, 26, 32, 15, 12, 29, 34, 88, 27, 29, 3, 33, 31, 5, 12, 30, 30, 20, 88));
		db.add(Arrays.asList(10, 22, 31, 17, 36, 3, 14, 34, 5, 6, 22, 23, 23, 29, 26, 7, 21, 11, 14, 30, 23, 35, 12));
		db.add(Arrays.asList(14, 30, 23, 35, 12, 12, 28, 15, 5, 13, 28, 20, 88, 28, 19, 29, 24, 32, 14, 26, 17, 16, 9,0));
		db.add(Arrays.asList(7, 13, 10, 25, 27, 19, 35, 1, 25, 18, 0, 19, 12, 8, 6, 17, 8, 20, 8, 30, 4, 12, 23, 10,20));
		db.add(Arrays.asList(18, 2, 5, 6, 21, 3, 32, 18, 34, 32, 16, 35, 31, 32, 8, 36, 0, 30, 17, 25, 10, 7, 29));
		db.add(Arrays.asList(20, 4, 36, 18, 25, 32, 7, 23, 4, 7, 34, 11, 6, 36, 23, 4, 1, 33, 88, 31, 27, 36, 21));
		db.add(Arrays.asList(15, 3, 27, 11, 19, 10, 6, 17, 16, 23, 27, 88, 1, 35, 16, 27, 31, 22, 36, 4, 20, 4, 36));
		db.add(Arrays.asList(23, 16, 1, 34, 33, 13, 7, 32, 21, 35, 16, 12, 36, 35, 88, 36, 30, 20, 15, 3, 27, 11, 19));
		db.add(Arrays.asList(11, 10, 27, 13, 1, 3, 27, 34, 1, 36, 19, 30, 24, 88, 19, 32, 29, 31, 23, 16, 1, 34, 33));
		db.add(Arrays.asList(34, 12, 10, 88, 6, 30, 27, 25, 28, 25, 34, 11, 17, 5, 27, 2, 33, 36, 29, 2, 1, 5, 13));
		db.add(Arrays.asList(0, 11, 17, 24, 11, 16, 12, 18, 18, 33, 19, 5, 25, 33, 18, 34, 5, 7, 27, 0, 18, 3, 88));
		db.add(Arrays.asList(15, 88, 30, 2, 16, 3, 15, 18, 5, 29, 30, 13, 31, 2, 31, 21, 12, 24, 23, 10, 11, 34, 21));
		db.add(Arrays.asList(1, 12, 19, 33, 0, 3, 28, 33, 30, 36, 23, 25, 23, 20, 3, 9, 3, 13, 26, 6, 88, 32, 6));
		db.add(Arrays.asList(24, 33, 10, 11, 36, 7, 13, 25, 5, 26, 5, 10, 28, 2, 10, 15, 29, 12, 28, 27, 4, 29, 21));
		db.add(Arrays.asList(5, 12, 17, 28, 29, 11, 19, 21, 16, 20, 12, 19, 4, 27, 23, 0, 15, 34, 24, 13, 14, 30, 9));
		db.add(Arrays.asList(16, 35, 2, 20, 4, 35, 5, 12, 17, 28, 29, 11, 21, 16, 20, 12, 19, 4, 27, 23, 0, 15));
		db.add(Arrays.asList(21, 21, 34, 27, 33, 33, 35, 26, 16, 4, 36, 35, 24, 24, 7, 16, 16, 8, 28, 10, 33, 30, 33));
		db.add(Arrays.asList(4, 36, 12, 88, 16, 29, 32, 17, 7, 4, 23, 21, 18, 5, 35, 7, 7, 12, 26, 23, 22, 22, 5));
		db.add(Arrays.asList(17, 31, 20, 21, 13, 22, 18, 20, 30, 7, 9, 17, 6, 33, 35, 31, 9, 88, 20, 8, 0, 28, 13));
		db.add(Arrays.asList(14, 6, 32, 17, 34, 28, 15, 1, 3, 15, 10, 36, 28, 35, 14, 6, 36, 6, 1, 16, 34, 31, 32));
		db.add(Arrays.asList(35, 30, 11, 14, 28, 12, 19, 30, 21, 19, 6, 32, 88, 22, 36, 33, 34, 17, 7, 15, 7, 27, 17));
		db.add(Arrays.asList(7, 27, 24, 30, 0, 21, 16, 24, 5, 16, 4, 6, 25, 11, 4, 27, 34, 22, 26, 28, 13, 0));
		db.add(Arrays.asList(18, 11, 4, 26, 30, 9, 1, 14, 4, 26, 28, 26, 13, 10, 32, 17, 15, 19, 27, 6, 10));
		db.add(Arrays.asList(16, 24, 12, 14, 9, 35, 8, 9, 2, 14, 35, 33, 22, 36, 25, 3, 36, 32, 24, 34, 16, 15, 27));
		db.add(Arrays.asList(24, 0, 5, 2, 9, 15, 21, 26, 13, 2, 7, 5, 15, 36, 88, 22, 13, 26, 88, 8, 15, 23, 2));
		db.add(Arrays.asList(26, 29, 3, 31, 2, 3, 14, 28, 0, 2, 8, 13, 24, 2, 36, 1, 5, 32, 31, 11, 23, 10, 4));
		db.add(Arrays.asList(18, 18, 3, 19, 2, 25, 26, 23, 0, 9, 29, 32, 12, 15, 18, 10, 18, 11, 11, 26, 29, 3, 31));
		db.add(Arrays.asList(16, 10, 28, 3, 6, 35, 16, 7, 16, 35, 25, 11, 2, 88, 30, 3, 26, 15, 12, 13, 16, 14, 34));
		db.add(Arrays.asList(6, 88, 19, 24, 26, 34, 2, 6, 32, 20, 31, 8, 33, 34, 29, 6, 5, 34, 19, 1, 20, 12, 30));
	}

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		int start = 4;
		int[] moves= new int[] {4,8};
//		int end = 24;
		//calculateBets(start, moves);
		showSpinAnalysis();
	}

	private static void calculateBets(int start, int[] moves) {
		List<Integer> seq = formRollingSequence(new ArrayList<Integer>(), start);
		int pos = seq.indexOf(start);
		for (int i : moves) {
			System.out.println("Last Num: " + seq.get(pos) + " : Next Possible Nums: " + seq.get(pos + i) + ", "
					+ seq.get(19 + pos + i) + ", " + seq.get(38 - (pos + i)) + ", " + seq.get(19 - (pos + i)));
		}
		
	}

	private static void showSpinAnalysis() {
		for (List<Integer> list : db) {
			for (int i = list.size() - 1; i > 0; i--) {
				int moved = getPositions(list.get(i), list.get(i - 1));
				// System.out.println("from:" + actual.get(i) + " :: To: " + actual.get(i - 1) +
				// " Moved: " + moved);
				System.out.print(moved + "-");
			}
			System.out.println();
		}
	}

	private static int getPositions(int start, int end) {
		boolean count = false;
		int moves = -1;
		List<Integer> seq = formRollingSequence(new ArrayList<Integer>(), start);
		for (Integer num : seq) {
			if (num == start) {
				count = true;
			}
			if (count) {
				moves++;
			}
			if (num == end) {
				count = false;
			}
		}
		if (moves >= 19) {
			moves = 38 - moves;
		}
		if(moves > 9 ) {
			moves = 19-moves;
		}
		return moves;
	}

	/**
	 * @param formation
	 * @param startNum
	 */
	private static List<Integer> formRollingSequence(List<Integer> formation, int startNum) {
		int startIndex = numbers.indexOf(startNum);
		if (startIndex != -1) {
			int k = startIndex;
			for (; k < 38; k++) {
				formation.add(numbers.get(k));
			}
			if (formation.size() != 38) {
				for (int l = 0; l < startIndex; l++) {
					formation.add(numbers.get(l));
				}
			}
		}
		return formation;
	}

}
