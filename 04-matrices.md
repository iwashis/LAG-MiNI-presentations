---
theme: default
title: Matrices
transition: slide-left
class: cover
fonts:
  provider: none
---

<div class="kicker">Linear Algebra · Warsaw University of Technology</div>

# Matrices

<div class="subtitle">Lecture 4 · Tomasz Brengos</div>

---
class: section-slide
transition: fade
---

<div class="sec-num">01</div>

<div class="kicker">Section 01</div>

# Motivation

---

# The central data structure of computing

If vectors are the standard container for data, *matrices* are the standard container for everything
two-dimensional — or that *acts* on data.

<v-clicks>

- A greyscale **image** is a matrix of pixel intensities; filters are matrix operations.
- A **graph** — road network, social network, the web — is its *adjacency matrix*.
- A neural network **layer** is a matrix of weights; training adjusts its entries.
- A spreadsheet, a database table, a search engine's term–document table — matrices again.

</v-clicks>

<!--
Big picture frame: everything after this is in service of making these examples computable.
-->

---

# Why multiplication looks so strange

The row-by-column rule for *multiplying* matrices is the strangest-looking definition of this chapter
— and the most consequential one: it is designed precisely so multiplication corresponds to
*composition* of transformations (Chapter on linear mappings).

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

This is why GPUs — the chips behind both video games and AI training — are machines optimised for one
task: multiplying enormous matrices fast. The true complexity of matrix multiplication (naively $O(n^3)$,
$O(n^{2.81})$ via Strassen) remains a famous open problem.

</div>

</v-click>

---

# Rank: the payoff at the end

Towards the end of the chapter: *elementary operations*, *echelon form*, and *rank*.

<v-click>

<div class="thm rem">

<span class="lbl">Remark</span>

Rank measures the genuine information content of a matrix: a $1000\times 1000$ matrix of rank $20$ is
reconstructed from $\sim 40\,000$ numbers instead of a million. Row reduction — computing the rank — is the
same engine that solves systems of equations and inverts matrices in the chapters ahead.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">02</div>

<div class="kicker">Section 02</div>

# Matrices

---

# Definition

<div class="thm def">

<span class="lbl">Definition</span>

An *$m\times n$ matrix over $\K$* is a rectangular table $(a_{ij})_{m\times n}$, $a_{ij}\in\K$. Two
matrices are *equal* if same size, same entries.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\left(\begin{smallmatrix} 1 & 0 & 2\\ -3 & \tfrac12 & 4 \end{smallmatrix}\right)$ is $2\times 3$ over $\R$.
Its rows are $(1,0,2)$, $(-3,\tfrac12,4)$; its columns are the three column vectors.

</div>

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

The rows of an $m\times n$ matrix live in $\K^n$; the columns live in $\K^m$.

</div>

</v-click>

---

# Special shapes

<div class="thm def">

<span class="lbl">Definition</span>

A matrix is *square* if $m=n$; *symmetric* if $a_{ij}=a_{ji}$; *diagonal* if $a_{ij}=0$ for
$i\neq j$; *upper* (*lower*) *triangular* if all entries below (above) the diagonal vanish.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\left(\begin{smallmatrix} 2 & 0\\ 0 & -1 \end{smallmatrix}\right)$ is diagonal;
$\left(\begin{smallmatrix} 1 & 5 & 0\\ 0 & 2 & -1\\ 0 & 0 & 3 \end{smallmatrix}\right)$ is upper triangular.
Every diagonal matrix is both.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">03</div>

<div class="kicker">Section 03</div>

# Matrix operations

---

# Addition and scaling

<div class="thm def">

<span class="lbl">Definition</span>

$A+B = (a_{ij}+b_{ij})$ for same-size $A,B$; $\ k\cdot A = (k\,a_{ij})$.

</div>

<v-click>

<StepThrough :steps="['\\left(\\begin{smallmatrix} 1 & 0 & 2\\\ -3 & \\frac12 & 4\\end{smallmatrix}\\right) + \\left(\\begin{smallmatrix} -3 & 1 & 4\\\ 2 & \\frac32 & 0\\end{smallmatrix}\\right) = \\left(\\begin{smallmatrix} -2 & 1 & 6\\\ -1 & 2 & 4\\end{smallmatrix}\\right)']" :captions="['addition, entrywise']" />

</v-click>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

Addition of matrices of *different* sizes is not defined.

</div>

</v-click>

---

# Properties (nothing surprising)

<div class="thm theo">

<span class="lbl">Theorem</span>

For $m\times n$ matrices $A,B,C$ and scalars $k_1,k_2$:

$$
A+0=A, \quad (A+B)+C=A+(B+C), \quad A+B=B+A, \quad k_1(A+B)=k_1A+k_1B, \quad (k_1+k_2)A=k_1A+k_2A.
$$

</div>

---

# Matrix multiplication

<div class="thm def">

<span class="lbl">Definition</span>

For a $k\times m$ matrix $A$ and $m\times n$ matrix $B$, $A\cdot B$ is $k\times n$ with

$$
c_{ij} = a_{i1}b_{1j}+a_{i2}b_{2j}+\ldots+a_{im}b_{mj}.
$$

</div>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

Defined *only* when the number of columns of $A$ equals the number of rows of $B$.

</div>

</v-click>

<v-click>

Watch the row of $A$ sweep across the column of $B$ — step through every entry of the product.

<div class="widget"><MatMul a=""1 0 2; 2 1 3"" b=""1 2; 0 1; 1 0"" /></div>

</v-click>

---

# Order matters

<div class="thm ex">

<span class="lbl">Example</span>

For the $A,B$ above, $A\cdot B$ is $2\times 2$ but $B\cdot A$ is $3\times 3$ — they need not even have the
same size, let alone be equal.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Remark — Matrix--vector products</span>

For $\vv\in\K^n$: $A\vv = x_1\cdot(\text{col}_1 A) + \ldots + x_n\cdot(\text{col}_n A)$ — the linear
combination of the columns of $A$, weighted by the entries of $\vv$. Used repeatedly from here on.

</div>

</v-click>

---

# Any field works, including finite ones

<div class="thm rem">

<span class="lbl">Remark</span>

All of matrix algebra — row reduction, rank, systems, determinants, inverses — works verbatim over
*any* field, including finite fields $\Z_p$. One simply reduces modulo $p$ at every step.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

Over $\Z_5$:

$$
\left(\begin{smallmatrix} 2 & 3\\ 4 & 1 \end{smallmatrix}\right)
\left(\begin{smallmatrix} 1 & 4\\ 2 & 3 \end{smallmatrix}\right)
= \left(\begin{smallmatrix} 8 & 17\\ 6 & 19 \end{smallmatrix}\right)
= \left(\begin{smallmatrix} 3 & 2\\ 1 & 4 \end{smallmatrix}\right) \pmod 5.
$$

</div>

</v-click>

---

# Identity, and properties of multiplication

<div class="thm def">

<span class="lbl">Definition</span>

$I_{n\times n}$ has $1$'s on the diagonal, $0$ elsewhere.

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

$(AB)C=A(BC)$,   $AI=IA=A$,   $(A+A_1)B=AB+A_1B$,   $A(B+B_1)=AB+AB_1$.

</div>

</v-click>

<v-click>

<div class="thm warn">

<span class="lbl">Warning</span>

Multiplication is in general *not commutative*:

$$
\left(\begin{smallmatrix} 0&1\\0&0\end{smallmatrix}\right)\left(\begin{smallmatrix} 0&0\\1&0\end{smallmatrix}\right) = \left(\begin{smallmatrix} 1&0\\0&0\end{smallmatrix}\right)
\quad\neq\quad
\left(\begin{smallmatrix} 0&0\\1&0\end{smallmatrix}\right)\left(\begin{smallmatrix} 0&1\\0&0\end{smallmatrix}\right) = \left(\begin{smallmatrix} 0&0\\0&1\end{smallmatrix}\right).
$$

</div>

</v-click>

---

# Zero products and no cancellation

<div class="thm warn">

<span class="lbl">Warning</span>

A product of two non-zero matrices can be zero: $A=\left(\begin{smallmatrix} 0&1\\0&0\end{smallmatrix}\right)\neq 0$
but $A\cdot A=0$. Consequently $AB=AC$ does *not* imply $B=C$.

</div>

<v-click>

<div class="thm def">

<span class="lbl">Definition — Powers</span>

$A^0=I$, $A^k=A^{k-1}\cdot A$. Associativity gives $A^kA^l=A^{k+l}$, $(A^k)^l=A^{kl}$.

</div>

</v-click>

<v-click>

<div class="thm ex">

<span class="lbl">Example — Counting walks</span>

For an adjacency matrix $A$, the $ij$-entry of $A^k$ counts walks of length $k$ from $i$ to $j$: for $k=2$,
$\sum_m a_{im}a_{mj}$ counts intermediate nodes $m$ with $i\to m\to j$.

</div>

</v-click>

---

# Transpose

<div class="thm def">

<span class="lbl">Definition</span>

$A^T$ swaps rows and columns of $A$.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

$A$ is symmetric iff $A^T=A$.

</div>

</v-click>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

$(A+B)^T=A^T+B^T$,   $(A^T)^T=A$,   $(kA)^T=kA^T$,   $(AB)^T = B^T A^T$ — order reversed.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">04</div>

<div class="kicker">Section 04</div>

# Elementary operations

---

# Row operations

<div class="thm def">

<span class="lbl">Definition</span>

*Elementary row operations*:

1. switch rows $i,j$   ($R_i\leftrightarrow R_j$);
2. scale row $i$ by nonzero $k$   ($kR_i\to R_i$);
3. add a multiple of row $j$ to row $i$   ($R_i+kR_j\to R_i$).

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

Each operation is invertible by an operation of the same type: swap by swap, scale by $\tfrac1k$, add by
subtract.

</div>

</v-click>

<v-click>

<div class="thm def">

<span class="lbl">Definition</span>

$A,B$ are *row equivalent* if one is reached from the other by such operations.

</div>

</v-click>

---
class: section-slide
transition: fade
---

<div class="sec-num">05</div>

<div class="kicker">Section 05</div>

# Row echelon form and rank

---

# Echelon form

<div class="thm def">

<span class="lbl">Definition</span>

$A$ is in *row echelon form* if all zero rows sit at the bottom, and each row's leading (first nonzero)
entry lies right of the one above it.

</div>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

Every matrix is row equivalent to one in row echelon form.

</div>

</v-click>

<v-click>

<StepThrough :steps="['\\left(\\begin{smallmatrix}1&0&2\\\\2&-1&3\\\\4&1&8\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}1&0&2\\\\0&-1&-1\\\\4&1&8\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}1&0&2\\\\0&-1&-1\\\\0&1&0\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}1&0&2\\\\0&-1&-1\\\\0&0&-1\\end{smallmatrix}\\right)']" :captions="['start', 'R2 - 2R1', 'R3 - 4R1', 'R3 + R2 — echelon form']" />

</v-click>

---

# Rank

<div class="thm def">

<span class="lbl">Definition</span>

*Row rank*: $\dim$ of the row span in $\K^n$. *Column rank*: $\dim$ of the column span in $\K^m$.

</div>

<v-click>

<div class="thm theo">

<span class="lbl">Theorem</span>

Row rank $=$ column rank, for every matrix. Call this common value $\rank(A)$.

</div>

</v-click>

<v-click>

<div class="thm rem">

<span class="lbl">Fact</span>

$\rank(A)=\rank(A^T)$ and $\rank(A)\leq\min(m,n)$.

</div>

</v-click>

---

# Computing rank by row reduction

<div class="thm theo">

<span class="lbl">Theorem</span>

Row equivalent matrices have equal rank, and the number of nonzero rows of an echelon form of $A$ equals
$\rank(A)$.

</div>

<v-click>

<StepThrough :steps="['\\left(\\begin{smallmatrix}1&2&1&0\\\\2&4&3&1\\\\3&6&4&1\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}1&2&1&0\\\\0&0&1&1\\\\0&0&1&1\\end{smallmatrix}\\right)', '\\left(\\begin{smallmatrix}1&2&1&0\\\\0&0&1&1\\\\0&0&0&0\\end{smallmatrix}\\right) \\implies \\rank(A)=2']" :captions="['a 3x4 matrix', 'R2-2R1, R3-3R1', 'R3-R2: two nonzero rows']" />

</v-click>

---

# Rank of a span

<div class="thm theo">

<span class="lbl">Theorem</span>

$\dim\Span{\{\vv_1,\ldots,\vv_m\}}$ in $\K^n$ equals $\rank$ of the matrix with rows $\vv_1,\ldots,\vv_m$.

</div>

<v-click>

<div class="thm ex">

<span class="lbl">Example</span>

$\Span{\{(1,2,1),(2,4,3),(3,6,4)\}}$: row reduce
$\left(\begin{smallmatrix}1&2&1\\2&4&3\\3&6&4\end{smallmatrix}\right) \to \left(\begin{smallmatrix}1&2&1\\0&0&1\\0&0&0\end{smallmatrix}\right)$
— dimension $2$, and $(1,2,1),(0,0,1)$ form a basis of the span.

</div>

</v-click>

---

# Summary

<v-clicks>

- A matrix packages rows and columns of a field; multiplication is row-times-column.
- Multiplication is associative but *not* commutative; zero products can hide non-zero factors.
- Elementary row operations preserve rank, and reduce any matrix to echelon form.
- $\rank(A)$ = number of nonzero echelon rows = the honest dimension hidden inside $A$.
- **Next lecture:** systems of linear equations — the algorithm behind the rank computation itself.

</v-clicks>
